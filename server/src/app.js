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
const corsOrigin = !process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*'
  ? true
  : process.env.CORS_ORIGIN.split(',');

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
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

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
