// Plano único por enquanto — sem tabela/coleção separada no banco porque só
// existe essa opção (o catálogo inteiro já é grátis pra qualquer conta; o
// plano pago só remove os anúncios). Se no futuro existir mais de um plano,
// aí sim vale migrar pra uma coleção própria; até lá, isso é suficiente e
// mais simples de manter.
const PREMIUM_PLAN = {
  id: 'premium',
  name: 'Premium',
  priceCents: 500, // R$5,00
  currency: 'BRL',
  interval: 'month',
  benefits: ['Sem anúncios em todo o site'],
};

module.exports = { PREMIUM_PLAN };
