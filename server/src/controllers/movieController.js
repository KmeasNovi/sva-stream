const Movie = require('../models/Movie');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// "Clássico" está em ~2/3 do catálogo (é mais uma tag de "domínio público"
// do que um gênero) e sempre é o último item quando presente (seed data),
// então nunca é uma boa categoria "principal" a não ser que seja o único
// gênero do filme. Usamos essa noção de gênero primário pra decidir em qual
// única fileira/categoria cada filme aparece, sem descartar os outros
// gêneros do dado (ainda usados como tags na página do filme e na busca).
const CATCH_ALL_GENRE = 'Clássico';

function getPrimaryGenre(genres = []) {
  return genres.find((g) => g !== CATCH_ALL_GENRE) || genres[0];
}

const slugify = (text) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

exports.listMovies = catchAsync(async (req, res) => {
  const { genre, search, featured, page = 1, limit = 24 } = req.query;
  const query = {};

  if (genre) query.genres = genre;
  if (featured === 'true') query.featured = true;
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  // Teto alto o bastante pra pedir o catálogo inteiro numa página só (ex: a
  // página /catalogo, que lista todos os filmes sem filtro de gênero).
  const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 24));

  let movies;
  let total;

  if (genre) {
    // Filtra pelo gênero primário, não só por "genres contém X" — garante
    // que cada filme só apareça na categoria em que ele é listado (evita o
    // mesmo filme repetido em várias fileiras, ex: Terror e Clássico).
    const candidates = await Movie.find(query).sort({ createdAt: -1 }).lean();
    const filtered = candidates.filter((m) => getPrimaryGenre(m.genres) === genre);
    total = filtered.length;
    movies = filtered.slice((pageNum - 1) * limitNum, (pageNum - 1) * limitNum + limitNum);
  } else {
    [movies, total] = await Promise.all([
      Movie.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Movie.countDocuments(query),
    ]);
  }

  res.json({
    success: true,
    data: movies,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

exports.getMovieBySlug = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!movie) return next(new AppError('Filme não encontrado', 404));

  res.json({ success: true, data: movie });
});

exports.listGenres = catchAsync(async (req, res) => {
  // Lista as categorias pelo gênero primário de cada filme (ver
  // getPrimaryGenre acima), não todo gênero/tag que aparece em algum filme
  // — senão a lista de categorias já viria com repetição implícita.
  const movies = await Movie.find({}, 'genres').lean();
  const primaryGenres = new Set(movies.map((m) => getPrimaryGenre(m.genres)).filter(Boolean));
  res.json({ success: true, data: [...primaryGenres].sort() });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);

  const movie = await Movie.create(payload);
  res.status(201).json({ success: true, data: movie });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) return next(new AppError('Filme não encontrado', 404));
  res.json({ success: true, data: movie });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return next(new AppError('Filme não encontrado', 404));
  res.json({ success: true, data: {} });
});
