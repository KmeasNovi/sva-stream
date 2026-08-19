// Plano único por enquanto — sem tabela/coleção separada no banco porque só
// existe essa opção (o catálogo inteiro já é grátis pra qualquer conta; o
// plano pago só remove os anúncios). Se no futuro existir mais de um plano,
// aí sim vale migrar pra uma coleção própria; até lá, isso é suficiente e
// mais simples de manter.
const PREMIUM_PLAN = {
  id: 'premium',
  name: 'Premium',
  priceCents: 499, // R$4,99
  currency: 'BRL',
  interval: 'month',
  benefits: ['Sem anúncios em todo o site'],
};

// CNPJ do próprio SepiaStream, usado pra criar o registro de cliente de
// TODOS os assinantes no Asaas — evita pedir CPF/CNPJ de cada pessoa que
// assina (decisão explícita do dono da plataforma: quem recebe a cobrança
// é sempre a mesma empresa, então é ela quem se identifica, não quem paga).
const ASAAS_OWNER_CPF_CNPJ = '66527927000192';

module.exports = { PREMIUM_PLAN, ASAAS_OWNER_CPF_CNPJ };
