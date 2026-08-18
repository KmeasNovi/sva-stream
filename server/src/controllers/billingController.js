const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { isAsaasConfigured, asaasRequest } = require('../config/asaas');
const { PREMIUM_PLAN, ASAAS_OWNER_CPF_CNPJ } = require('../config/plans');

// Reaproveita o cliente Asaas já criado pro usuário (subscription.providerCustomerId)
// ou cria um novo — evita duplicar cliente a cada tentativa de assinatura.
// cpfCnpj é sempre o do SepiaStream (ver config/plans.js) — não pedimos
// documento de cada assinante, só o email/nome já cadastrados na conta.
async function ensureAsaasCustomer(user) {
  if (user.subscription?.providerCustomerId) {
    return user.subscription.providerCustomerId;
  }

  const customer = await asaasRequest('POST', '/customers', {
    name: user.name,
    email: user.email,
    cpfCnpj: ASAAS_OWNER_CPF_CNPJ,
    externalReference: String(user._id),
  });

  user.subscription.providerCustomerId = customer.id;
  await user.save();

  return customer.id;
}

exports.subscribe = catchAsync(async (req, res, next) => {
  if (!isAsaasConfigured()) {
    return next(new AppError('Assinaturas ainda não estão disponíveis. Volte em breve!', 503));
  }

  const { billingType } = req.body;

  if (req.user.isPremiumActive()) {
    return next(new AppError('Você já é assinante Premium', 400));
  }

  const customerId = await ensureAsaasCustomer(req.user);

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + 1);

  const subscription = await asaasRequest('POST', '/subscriptions', {
    customer: customerId,
    // UNDEFINED deixa a pessoa escolher PIX/boleto/cartão na própria fatura,
    // em vez de forçar uma escolha aqui antes de existir um formulário dedicado.
    billingType: billingType || 'UNDEFINED',
    value: PREMIUM_PLAN.priceCents / 100,
    nextDueDate: nextDueDate.toISOString().slice(0, 10),
    cycle: 'MONTHLY',
    description: `SepiaStream ${PREMIUM_PLAN.name}`,
    externalReference: String(req.user._id),
  });

  req.user.subscription.provider = 'asaas';
  req.user.subscription.providerSubscriptionId = subscription.id;
  req.user.subscription.status = 'pending';
  await req.user.save();

  // A primeira cobrança da assinatura é gerada pelo Asaas logo em seguida,
  // mas sem garantia estrita de timing — tenta buscar o link da fatura uma
  // vez; se ainda não existir, o front avisa que está gerando e a pessoa
  // pode conferir depois (o webhook atualiza o status quando o pagamento
  // acontecer, independente de ela ver o link agora).
  let invoiceUrl = null;
  try {
    const payments = await asaasRequest('GET', `/subscriptions/${subscription.id}/payments`);
    invoiceUrl = payments.data?.[0]?.invoiceUrl || null;
  } catch {
    // segue sem invoiceUrl
  }

  res.status(201).json({ success: true, data: { invoiceUrl } });
});

// Cancela a renovação — a assinatura é removida no Asaas (nenhuma cobrança
// nova é gerada), mas o acesso Premium continua até currentPeriodEnd, já que
// esse período já foi pago. isPremiumActive() já checa essa data sozinho,
// então não precisa de nenhum job/cron pra "desligar" o acesso depois.
exports.cancel = catchAsync(async (req, res, next) => {
  if (!isAsaasConfigured()) {
    return next(new AppError('Assinaturas ainda não estão disponíveis.', 503));
  }

  const subscriptionId = req.user.subscription?.providerSubscriptionId;
  if (!subscriptionId) {
    return next(new AppError('Você não tem uma assinatura pra cancelar', 400));
  }

  if (req.user.subscription.cancelAtPeriodEnd) {
    return next(new AppError('Sua assinatura já está marcada pra não renovar', 400));
  }

  await asaasRequest('DELETE', `/subscriptions/${subscriptionId}`);

  req.user.subscription.cancelAtPeriodEnd = true;
  await req.user.save();

  res.json({ success: true, data: { currentPeriodEnd: req.user.subscription.currentPeriodEnd } });
});

// Webhook do Asaas — notifica mudanças de status de cobrança. Validado por um
// token compartilhado configurado em Asaas > Integrações > Webhooks, enviado
// de volta no header `asaas-access-token` a cada notificação recebida.
exports.webhook = catchAsync(async (req, res, next) => {
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  if (expectedToken && req.headers['asaas-access-token'] !== expectedToken) {
    return next(new AppError('Token de webhook inválido', 401));
  }

  const { event, payment } = req.body || {};
  const subscriptionId = payment?.subscription;

  if (subscriptionId) {
    const user = await User.findOne({ 'subscription.providerSubscriptionId': subscriptionId });

    if (user) {
      if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
        user.subscription.status = 'active';
        // O objeto payment do Asaas não tem um campo "próximo vencimento" —
        // como toda assinatura aqui é sempre mensal (cycle: 'MONTHLY' em
        // exports.subscribe), a validade é o vencimento desta cobrança + 1
        // mês, replicando o próprio agendamento que o Asaas usa internamente.
        const periodEnd = new Date(payment.dueDate);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        user.subscription.currentPeriodEnd = periodEnd;
      } else if (event === 'PAYMENT_OVERDUE') {
        user.subscription.status = 'past_due';
      } else if (event === 'SUBSCRIPTION_DELETED' || event === 'PAYMENT_DELETED') {
        user.subscription.status = 'canceled';
      }
      await user.save();
    }
  }

  res.json({ success: true });
});
