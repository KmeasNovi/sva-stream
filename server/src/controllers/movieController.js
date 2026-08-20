const Movie = require('../models/Movie');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { revalidateMovie } = require('../utils/revalidate');

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

// Categorias de gênero "de verdade" pra fileira "Em destaque" — de fora
// ficam "Clássico" (tag genérica, quase todo o catálogo) e "Mudo" (formato,
// não gênero, só 3 filmes).
const FEATURED_GENRES = [
  'Animação',
  'Animes',
  'Aventura',
  'Comédia',
  'Documentário',
  'Drama',
  'Faroeste',
  'Ficção Científica',
  'Romance',
  'Suspense',
  'Terror',
];

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

  if (genre && typeof genre === 'string') query.genres = genre;
  if (featured === 'true') query.featured = true;
  if (search && typeof search === 'string') query.$text = { $search: search };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  // Teto alto o bastante pra pedir o catálogo inteiro numa página só (usado
  // pelo admin ao escolher "10000 por página").
  const limitNum = Math.min(10000, Math.max(1, parseInt(limit, 10) || 24));

  let movies;
  let total;

  if (genre) {
    // Filtra pelo gênero primário, não só por "genres contém X" — garante
    // que cada filme só apareça na categoria em que ele é listado (evita o
    // mesmo filme repetido em várias fileiras, ex: Terror e Clássico).
    //
    // Antes isso buscava TODOS os filmes com a tag (ex: 1.138 pra "Comédia")
    // pro Node só pra filtrar e devolver 12 — com o catálogo grande isso
    // sobrecarregava a home a cada visita. Agora o filtro por gênero
    // primário e a paginação acontecem dentro do próprio MongoDB via
    // aggregation, então só os documentos da página pedida trafegam.
    const primaryGenreExpr = {
      $let: {
        vars: {
          nonCatchAll: {
            $filter: { input: '$genres', cond: { $ne: ['$$this', CATCH_ALL_GENRE] } },
          },
        },
        in: {
          $ifNull: [{ $arrayElemAt: ['$$nonCatchAll', 0] }, { $arrayElemAt: ['$genres', 0] }],
        },
      },
    };

    const [result] = await Movie.aggregate([
      { $match: query },
      { $addFields: { primaryGenre: primaryGenreExpr } },
      { $match: { primaryGenre: genre } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    movies = result.data;
    total = result.totalCount[0]?.count || 0;
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

// Rota pública (sem auth) — lista o catálogo (só os campos usados pelo
// grid: título, slug, pôster, ano, gêneros), pra /catalogo ser indexável e
// navegável sem login. Não é uma exposição nova de dado: o sitemap.xml já
// lista todos os slugs publicamente, e cada filme já tem página pública
// própria — isso só junta tudo numa lista, sem sinopse.
//
// Paginada (scroll infinito no front) — antes devolvia o catálogo inteiro
// numa resposta só, o que virou 1MB+ de JSON e milhares de cards montados
// de uma vez assim que o catálogo passou de ~3.000 títulos.
const PUBLIC_LIST_FIELDS = 'title slug posterUrl backdropUrl year genres';

exports.listMoviesPublic = catchAsync(async (req, res) => {
  const { page = 1, limit = 60, sort = 'alpha', genre, search } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(120, Math.max(1, parseInt(limit, 10) || 60));
  // 'recent' = mais recém-adicionado primeiro, usado pela fileira "Adicionados
  // recentemente" de /home (equivalente ao default do listMovies acima, que
  // exige login — essa é a versão pública, mesmo critério).
  const sortSpec =
    sort === 'year' ? { year: 1, title: 1 } : sort === 'recent' ? { createdAt: -1 } : { title: 1 };

  // Filtro por gênero (usado por /genre/[genre] sem exigir login) — mesma
  // lógica de "gênero primário" do listMovies acima (ver comentário lá),
  // só que com o teto de 120 por página e os campos limitados da versão
  // pública, pra não reabrir a brecha de scraping que o teto existe pra evitar.
  if (genre && typeof genre === 'string') {
    const primaryGenreExpr = {
      $let: {
        vars: {
          nonCatchAll: {
            $filter: { input: '$genres', cond: { $ne: ['$$this', CATCH_ALL_GENRE] } },
          },
        },
        in: {
          $ifNull: [{ $arrayElemAt: ['$$nonCatchAll', 0] }, { $arrayElemAt: ['$genres', 0] }],
        },
      },
    };

    const [result] = await Movie.aggregate([
      { $addFields: { primaryGenre: primaryGenreExpr } },
      { $match: { primaryGenre: genre } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            { $project: { title: 1, slug: 1, posterUrl: 1, backdropUrl: 1, year: 1, genres: 1 } },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const total = result.totalCount[0]?.count || 0;
    return res.json({
      success: true,
      data: result.data,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  }

  const query = {};
  if (search && typeof search === 'string') query.$text = { $search: search };

  const [movies, total] = await Promise.all([
    Movie.find(query)
      .sort(sortSpec)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select(PUBLIC_LIST_FIELDS)
      .lean(),
    Movie.countDocuments(query),
  ]);

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

// Rota pública (sem auth) — só o necessário pra a página de filme ser
// indexável pelo Google e assistível por quem chega de uma busca sem estar
// logado. Devolve o filme + relacionados numa chamada só, em vez de expor a
// listagem genérica (`GET /`) publicamente, que permitiria enumerar/raspar
// o catálogo inteiro em poucas requisições.
exports.getMoviePublicBySlug = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!movie) return next(new AppError('Filme não encontrado', 404));

  const primaryGenre = getPrimaryGenre(movie.genres);
  const related = primaryGenre
    ? await Movie.find({ genres: primaryGenre, slug: { $ne: movie.slug } })
        .sort({ createdAt: -1 })
        .limit(13)
        .select('title slug posterUrl backdropUrl year')
        .lean()
    : [];

  res.json({ success: true, data: { movie, related } });
});

// Rota pública (sem auth) — um punhado de filmes (título, slug, pôster) pra
// landing page mostrar títulos de verdade com link real, em vez de só
// decoração sem texto. Isso dá ao Google conteúdo indexável na página de
// maior autoridade do site associando ela aos nomes dos filmes, além de
// ajudar quem chega de uma busca a navegar pro resto do catálogo. Não expõe
// sinopse nem o catálogo inteiro — só um recorte pequeno (~1 por gênero).
exports.listPublicHighlights = catchAsync(async (req, res) => {
  const HIGHLIGHT_COUNT = 30; // múltiplo de 2, 3 e 5 — as colunas do grid em
  // cada largura de tela — pra nunca sobrar uma última fileira incompleta.
  const movies = await Movie.find({}).sort({ featured: -1, views: -1, title: 1 }).lean();

  // 1ª passada: um filme por gênero primário, pra diversidade.
  const picked = [];
  const seenGenres = new Set();
  for (const movie of movies) {
    const genre = getPrimaryGenre(movie.genres);
    if (genre && seenGenres.has(genre)) continue;
    if (genre) seenGenres.add(genre);
    picked.push(movie);
    if (picked.length >= HIGHLIGHT_COUNT) break;
  }

  // 2ª passada: como o catálogo tem menos gêneros distintos do que
  // HIGHLIGHT_COUNT, completa o resto com outros filmes (repetindo gênero),
  // pra sempre fechar em HIGHLIGHT_COUNT itens exatos.
  if (picked.length < HIGHLIGHT_COUNT) {
    const pickedIds = new Set(picked.map((m) => String(m._id)));
    for (const movie of movies) {
      if (pickedIds.has(String(movie._id))) continue;
      picked.push(movie);
      pickedIds.add(String(movie._id));
      if (picked.length >= HIGHLIGHT_COUNT) break;
    }
  }

  res.json({
    success: true,
    data: picked.map((m) => ({
      title: m.title,
      slug: m.slug,
      year: m.year,
      posterUrl: m.posterUrl,
      backdropUrl: m.backdropUrl,
    })),
  });
});

// Rota pública (sem auth) — só slug + data de atualização, pro sitemap.xml
// do frontend saber quais URLs de filme existem. Não expõe título, sinopse,
// pôster nem qualquer outro dado — só o suficiente pra gerar as <url> do
// sitemap.
exports.listSlugsForSitemap = catchAsync(async (req, res) => {
  const movies = await Movie.find({}, 'slug updatedAt').lean();
  res.json({ success: true, data: movies.map((m) => ({ slug: m.slug, updatedAt: m.updatedAt })) });
});

exports.listFeatured = catchAsync(async (req, res) => {
  // Um filme por categoria (ver FEATURED_GENRES): dentro de cada categoria,
  // prioriza um filme marcado featured=true manualmente pelo admin, senão o
  // mais visto, senão ordem alfabética — só pra ter um critério estável.
  const movies = await Movie.find({}).sort({ featured: -1, views: -1, title: 1 }).lean();

  const picked = [];
  for (const genre of FEATURED_GENRES) {
    const candidate = movies.find((m) => getPrimaryGenre(m.genres) === genre);
    if (candidate) picked.push(candidate);
  }

  res.json({ success: true, data: picked });
});

exports.listGenres = catchAsync(async (req, res) => {
  // Lista as categorias pelo gênero primário de cada filme (ver
  // getPrimaryGenre acima), não todo gênero/tag que aparece em algum filme
  // — senão a lista de categorias já viria com repetição implícita.
  const movies = await Movie.find({}, 'genres').lean();
  const primaryGenres = new Set(movies.map((m) => getPrimaryGenre(m.genres)).filter(Boolean));
  res.json({ success: true, data: [...primaryGenres].sort() });
});

// Rota pública (sem auth) — mesma lista de categorias acima, usada por
// /home e /search sem exigir login (navegação livre, só favoritar exige
// conta — ver FavoriteButton.jsx).
exports.listGenresPublic = exports.listGenres;

// Rota pública (sem auth) — mesma seleção de "Em destaque" do listFeatured
// acima, com os campos limitados da versão pública (sem sinopse), usada
// pela Hero Carousel de /home sem exigir login.
exports.listFeaturedPublic = catchAsync(async (req, res) => {
  const movies = await Movie.find({})
    .sort({ featured: -1, views: -1, title: 1 })
    .select(PUBLIC_LIST_FIELDS)
    .lean();

  const picked = [];
  for (const genre of FEATURED_GENRES) {
    const candidate = movies.find((m) => getPrimaryGenre(m.genres) === genre);
    if (candidate) picked.push(candidate);
  }

  res.json({ success: true, data: picked });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);

  const movie = await Movie.create(payload);
  await revalidateMovie(movie.slug);
  res.status(201).json({ success: true, data: movie });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) return next(new AppError('Filme não encontrado', 404));
  await revalidateMovie(movie.slug);
  res.json({ success: true, data: movie });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return next(new AppError('Filme não encontrado', 404));
  await revalidateMovie(movie.slug);
  res.json({ success: true, data: {} });
});

// Inclusão em lote — mesmo padrão de upsert-por-slug usado em
// server/src/seed/seedMovies.js, então importar o mesmo filme duas vezes
// (ex: reimportar um CSV corrigido) atualiza em vez de duplicar. Cada item é
// processado isoladamente: um erro num item não derruba os outros, e o
// resumo devolvido diz exatamente quais linhas falharam e por quê.
exports.bulkCreateMovies = catchAsync(async (req, res, next) => {
  const { movies } = req.body;
  if (!Array.isArray(movies) || movies.length === 0) {
    return next(new AppError('Envie um array "movies" com pelo menos um filme', 400));
  }
  if (movies.length > 500) {
    return next(new AppError('Máximo de 500 filmes por lote', 400));
  }

  let created = 0;
  let updated = 0;
  const errors = [];

  for (let i = 0; i < movies.length; i += 1) {
    const raw = movies[i];
    const label = (raw && raw.title) || `item #${i + 1}`;
    try {
      const payload = { ...raw };
      if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
      if (!payload.slug) throw new Error('título ou slug ausente');
      if (!payload.synopsis) throw new Error('sinopse ausente');
      if (!payload.source || !payload.source.id || !payload.source.provider) {
        throw new Error('source.provider e source.id são obrigatórios');
      }

      const existing = await Movie.findOne({ slug: payload.slug }).select('_id').lean();
      await Movie.updateOne({ slug: payload.slug }, { $set: payload }, { upsert: true, runValidators: true });
      if (existing) updated += 1;
      else created += 1;
    } catch (err) {
      errors.push({ index: i, title: label, message: err.message });
    }
  }

  // Lote pode ter dezenas/centenas de filmes — revalida só as páginas gerais
  // (catálogo, home) em vez de uma por slug, senão isso vira centenas de
  // requisições sequenciais pro Next.js.
  await revalidateMovie();

  res.status(errors.length ? 207 : 201).json({
    success: true,
    data: { created, updated, failed: errors.length, errors },
  });
});
