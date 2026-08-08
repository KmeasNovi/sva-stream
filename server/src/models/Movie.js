const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
  {
    // De onde o vídeo é servido de fato. Nunca guardamos o arquivo do filme aqui,
    // só a referência — quem serve o streaming é o archive.org ou o YouTube.
    provider: {
      type: String,
      enum: ['archive', 'youtube'],
      required: true,
    },
    // Para 'archive': o identifier do item (ex: "night_of_the_living_dead").
    // Para 'youtube': o videoId (ex: "dQw4w9WgXcQ").
    id: { type: String, required: true },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    synopsis: { type: String, required: true },
    year: { type: Number },
    director: { type: String },
    cast: { type: [String], default: [] },
    genres: { type: [String], default: [], index: true },
    language: { type: String, default: 'pt' },
    runtimeMinutes: { type: Number },
    posterUrl: { type: String },
    backdropUrl: { type: String },
    source: { type: sourceSchema, required: true },
    // Caminho relativo pro arquivo .vtt de legenda em pt-BR servido por nós
    // mesmos (ex: "/subtitles/nosferatu.vtt") — só existe pros títulos onde já
    // traduzimos. Sem isso, o player toca sem legenda.
    subtitleUrl: { type: String },
    // URL direta do arquivo de vídeo no archive.org (resolvida uma vez, na hora
    // de cadastrar a legenda). Só é usada quando subtitleUrl existe — nesses
    // casos o player troca do iframe padrão pra um <video> nativo, porque um
    // iframe de outro domínio não permite injetar uma trilha de legenda nossa.
    videoFileUrl: { type: String },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

movieSchema.index({ title: 'text', synopsis: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
