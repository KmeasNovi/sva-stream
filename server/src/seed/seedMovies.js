require('dotenv').config();
const connectDB = require('../config/db');
const Movie = require('../models/Movie');
const Admin = require('../models/Admin');
const bulkMovies = require('./bulkMovies');
const bulkMovies2 = require('./bulkMovies2');
const bulkMovies3 = require('./bulkMovies3');
const bulkMovies4 = require('./bulkMovies4');
const bulkMovies5 = require('./bulkMovies5');
const bulkMovies6 = require('./bulkMovies6');
const bulkMovies7 = require('./bulkMovies7');
const bulkMovies8 = require('./bulkMovies8');
const bulkMovies9 = require('./bulkMovies9');
const bulkMovies10 = require('./bulkMovies10');
const bulkMovies11 = require('./bulkMovies11');
const bulkMovies12 = require('./bulkMovies12');
const bulkMovies13 = require('./bulkMovies13');
const bulkMovies14 = require('./bulkMovies14');
const bulkMovies15 = require('./bulkMovies15');
const bulkMovies16 = require('./bulkMovies16');
const bulkMovies17 = require('./bulkMovies17');
const bulkMovies18 = require('./bulkMovies18');
const bulkMovies19 = require('./bulkMovies19');
const bulkMovies20 = require('./bulkMovies20');
const bulkMovies21 = require('./bulkMovies21');
const bulkMovies22 = require('./bulkMovies22');
const bulkMovies23 = require('./bulkMovies23');
const bulkMovies24 = require('./bulkMovies24');
const bulkMovies25 = require('./bulkMovies25');
const bulkMovies26 = require('./bulkMovies26');
const bulkMovies27 = require('./bulkMovies27');
const bulkMovies28 = require('./bulkMovies28');
const bulkMovies29 = require('./bulkMovies29');
const bulkMovies30 = require('./bulkMovies30');
const bulkMovies31 = require('./bulkMovies31');
const bulkMovies32 = require('./bulkMovies32');
const bulkMovies33 = require('./bulkMovies33');
const bulkMovies34 = require('./bulkMovies34');
const bulkMovies35 = require('./bulkMovies35');
const bulkMovies36 = require('./bulkMovies36');
const bulkMovies37 = require('./bulkMovies37');
const bulkMovies38 = require('./bulkMovies38');
const bulkMovies39 = require('./bulkMovies39');
const bulkMovies40 = require('./bulkMovies40');
const bulkMovies41 = require('./bulkMovies41');
const bulkMovies42 = require('./bulkMovies42');
const bulkMovies43 = require('./bulkMovies43');
const bulkMovies44 = require('./bulkMovies44');
const bulkMovies45 = require('./bulkMovies45');
const bulkMovies46 = require('./bulkMovies46');
const bulkMovies47 = require('./bulkMovies47');
const bulkMovies48 = require('./bulkMovies48');
const bulkMovies49 = require('./bulkMovies49');
const bulkMovies50 = require('./bulkMovies50');
const bulkMovies51 = require('./bulkMovies51');
const bulkAnimations = require('./bulkAnimations');

// Filmes clássicos em domínio público, hospedados no archive.org.
// "source.id" é o identifier do item no archive.org (o que aparece na URL
// https://archive.org/details/<identifier>). O player embute direto de lá,
// então não guardamos nenhum arquivo de vídeo no nosso banco.
const movies = [
  {
    title: 'Night of the Living Dead',
    slug: 'night-of-the-living-dead',
    synopsis:
      'Um grupo de pessoas se refugia em uma fazenda isolada enquanto mortos-vivos cercam a casa. O filme que fundou o gênero moderno de zumbis.',
    year: 1968,
    director: 'George A. Romero',
    cast: ['Duane Jones', 'Judith O’Dea'],
    genres: ['Terror', 'Clássico'],
    runtimeMinutes: 96,
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg',
    backdropUrl: 'https://archive.org/services/img/night-of-the-living-dead-1968_202508',
    source: { provider: 'archive', id: 'night-of-the-living-dead-1968_202508' },
    featured: true,
  },
  {
    title: 'Nosferatu',
    slug: 'nosferatu',
    synopsis:
      'A adaptação não-oficial de Drácula que se tornou um marco do cinema expressionista alemão e do horror mudo.',
    year: 1922,
    director: 'F. W. Murnau',
    cast: ['Max Schreck'],
    genres: ['Terror', 'Mudo', 'Clássico'],
    runtimeMinutes: 94,
    posterUrl:
      'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg/500px-Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg',
    backdropUrl: 'https://archive.org/services/img/Nosferatu1922',
    source: { provider: 'archive', id: 'Nosferatu1922' },
    featured: true,
  },
  {
    title: 'His Girl Friday',
    slug: 'his-girl-friday',
    synopsis:
      'Uma comédia de ritmo acelerado sobre um editor de jornal que tenta impedir que sua ex-mulher e melhor repórter se case novamente.',
    year: 1940,
    director: 'Howard Hawks',
    cast: ['Cary Grant', 'Rosalind Russell'],
    genres: ['Comédia', 'Romance', 'Clássico'],
    runtimeMinutes: 92,
    posterUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/His_Girl_Friday_%281940_poster%29_crop.jpg/500px-His_Girl_Friday_%281940_poster%29_crop.jpg',
    backdropUrl: 'https://archive.org/services/img/his_girl_friday',
    source: { provider: 'archive', id: 'his_girl_friday' },
    featured: false,
  },
  {
    title: 'The Cabinet of Dr. Caligari',
    slug: 'the-cabinet-of-dr-caligari',
    synopsis:
      'Um hipnotizador e seu sonâmbulo aterrorizam uma pequena cidade alemã. Obra-prima do expressionismo alemão.',
    year: 1920,
    director: 'Robert Wiene',
    cast: ['Werner Krauss', 'Conrad Veidt'],
    genres: ['Terror', 'Mudo', 'Clássico'],
    runtimeMinutes: 76,
    posterUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Das_Cabinet_des_Dr._Caligari.JPG/500px-Das_Cabinet_des_Dr._Caligari.JPG',
    backdropUrl: 'https://archive.org/services/img/the-cabinet-of-dr-caligari-1920',
    source: { provider: 'archive', id: 'the-cabinet-of-dr-caligari-1920' },
    featured: false,
  },
];

async function run() {
  await connectDB();

  const allMovies = [...movies, ...bulkMovies, ...bulkMovies2, ...bulkMovies3, ...bulkMovies4, ...bulkMovies5, ...bulkMovies6, ...bulkMovies7, ...bulkMovies8, ...bulkMovies9, ...bulkMovies10, ...bulkMovies11, ...bulkMovies12, ...bulkMovies13, ...bulkMovies14, ...bulkMovies15, ...bulkMovies16, ...bulkMovies17, ...bulkMovies18, ...bulkMovies19, ...bulkMovies20, ...bulkMovies21, ...bulkMovies22, ...bulkMovies23, ...bulkMovies24, ...bulkMovies25, ...bulkMovies26, ...bulkMovies27, ...bulkMovies28, ...bulkMovies29, ...bulkMovies30, ...bulkMovies31, ...bulkMovies32, ...bulkMovies33, ...bulkMovies34, ...bulkMovies35, ...bulkMovies36, ...bulkMovies37, ...bulkMovies38, ...bulkMovies39, ...bulkMovies40, ...bulkMovies41, ...bulkMovies42, ...bulkMovies43, ...bulkMovies44, ...bulkMovies45, ...bulkMovies46, ...bulkMovies47, ...bulkMovies48, ...bulkMovies49, ...bulkMovies50, ...bulkMovies51, ...bulkAnimations];

  for (const movie of allMovies) {
    await Movie.updateOne({ slug: movie.slug }, { $set: movie }, { upsert: true });
    console.log(`Seed: ${movie.title}`);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (!existing) {
      const passwordHash = await Admin.hashPassword(adminPassword);
      await Admin.create({ email: adminEmail.toLowerCase(), passwordHash });
      console.log(`Admin criado: ${adminEmail}`);
    } else {
      console.log('Admin já existe, pulando criação.');
    }
  } else {
    console.log('SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD não definidos — nenhum admin criado.');
  }

  console.log('Seed concluído.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
