const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { isAsaasConfigured, asaasRequest } = require('../config/asaas');
const { PREMIUM_PLAN } = require('../config/plans');

// Reaproveita o cliente Asaas já criado pro usuário (subscription.providerCustomerId)
// ou cria um novo — evita duplicar cliente a cada tentativa de assinatura.
async function ensureAsaasCustomer(user, cpfCnpj) {
  if (user.subscription?.providerCustomerId) {
    return user.subscription.providerCustomerId;
  }

  const customer = await asaasRequest('POST', '/customers', {
    name: user.name,
    email: user.email,
    cpfCnpj,
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

  const { cpfCnpj, billingType } = req.body;
  if (typeof cpfCnpj !== 'string' || !cpfCnpj.replace(/\D/g, '')) {
    return next(new AppError('Informe um CPF ou CNPJ válido', 400));
  }

  if (req.user.isPremiumActive()) {
    return next(new AppError('Você já é assinante Premium', 400));
  }

  const customerId = await ensureAsaasCustomer(req.user, cpfCnpj.replace(/\D/g, ''));

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
        // Acesso vale até o vencimento da próxima cobrança da assinatura.
        user.subscription.currentPeriodEnd = new Date(payment.nextDueDate || payment.dueDate);
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
