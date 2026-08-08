const Movie = require('../models/Movie');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

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
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 24));

  const [movies, total] = await Promise.all([
    Movie.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
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

exports.listGenres = catchAsync(async (req, res) => {
  const genres = await Movie.distinct('genres');
  res.json({ success: true, data: genres.sort() });
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
