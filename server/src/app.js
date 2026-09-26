const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const userRoutes = require('./routes/userRoutes');
const billingRoutes = require('./routes/billingRoutes');
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const providerRoutes = require('./routes/providerRoutes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

// Render fica atrás de um único proxy reverso — precisa disso pro
// express-rate-limit (e req.ip em geral) enxergar o IP real do cliente
// em vez do IP do proxy.
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
// CORS_ORIGIN=* teria virado ['*'] ao dar split — a lib `cors` compara o
// Origin da requisição contra esse array por igualdade estrita, então nunca
// batia com "*" e o header Access-Control-Allow-Origin nunca era enviado
// (todo fetch autenticado do browser falhava silenciosamente com "Failed to
// fetch", mesmo funcionando via curl). Aqui tratamos "*"/vazio à parte.
//
// Além da lista do env, qualquer subdomínio https de sepiastream.com é aceito
// (flyer., pro., admin. etc.) — senão cada subdomínio novo exigia lembrar de
// editar CORS_ORIGIN no Render, e o flyer chegou a ir ao ar bloqueado.
const SEPIASTREAM_ORIGIN = /^https:\/\/([a-z0-9-]+\.)?sepiastream\.com$/;
const corsAllowList = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
const corsOrigin = !process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*'
  ? true
  : (origin, callback) => callback(null, !origin || corsAllowList.includes(origin) || SEPIASTREAM_ORIGIN.test(origin));

app.use(cors({ origin: corsOrigin }));
// Padrão do express é 100kb — estoura fácil em lote grande (ex: corrigir
// filmes com o catálogo inteiro quebrado manda 1000+ itens de uma vez, ou
// bulkCreateMovies com sinopse de cada filme). Acima do limite o body-parser
// rejeita a requisição inteira antes dela chegar em qualquer rota, e o
// errorHandler devolve só "Erro interno do servidor" sem pista nenhuma do
// motivo real.
app.use(express.json({ limit: '5mb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Arquivos .vtt de legenda em pt-BR que traduzimos — servidos como estáticos,
// referenciados pelo campo subtitleUrl do filme (ex: /subtitles/nosferatu.vtt).
app.use('/subtitles', express.static(path.join(__dirname, '..', 'public', 'subtitles')));

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/health-check', healthCheckRoutes);
app.use('/api/providers', providerRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
