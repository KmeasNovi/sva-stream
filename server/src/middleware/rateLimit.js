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

module.exports = { apiLimiter, authLimiter };
