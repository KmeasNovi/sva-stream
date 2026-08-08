const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Arquivos .vtt de legenda em pt-BR que traduzimos — servidos como estáticos,
// referenciados pelo campo subtitleUrl do filme (ex: /subtitles/nosferatu.vtt).
app.use('/subtitles', express.static(path.join(__dirname, '..', 'public', 'subtitles')));

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
