require('dotenv').config();
const connectDB = require('../config/db');
const Movie = require('../models/Movie');
const Admin = require('../models/Admin');
const bulkMovies = require('./bulkMovies');
const bulkMovies2 = require('./bulkMovies2');
const bulkMovies3 = require('./bulkMovies3');
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

  const allMovies = [...movies, ...bulkMovies, ...bulkMovies2, ...bulkMovies3, ...bulkAnimations];

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
