const rateLimit = require('express-rate-limit');

// Limite geral pra toda a API — piso contra scraping/abuso bruto.
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

// Limite restrito pra rotas sensíveis (login, cadastro, reenvio de email,
// newsletter) — essas são as que valem a pena forçar bruta ou usar pra
// bombardear email de terceiros via Brevo.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas. Tente novamente em 15 minutos.' },
});

// Pedido de contratação de provedor (flyer) — gera e-mail pra nós e pro
// provedor, então segura spam sem atrapalhar quem erra um campo e reenvia.
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitos envios. Tente novamente em uma hora ou fale com contato@sepiastream.com.' },
});

module.exports = { apiLimiter, authLimiter, leadLimiter };
