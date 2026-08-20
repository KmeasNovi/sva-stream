const express = require('express');
const movieController = require('../controllers/movieController');
const { requireAdmin, requireAdminOrUser } = require('../middleware/auth');

const router = express.Router();

// Públicas (sem auth) — só o necessário pra SEO/indexação das páginas de
// filme individuais. Ver comentário em movieController.js.
router.get('/sitemap', movieController.listSlugsForSitemap);
router.get('/public/highlights', movieController.listPublicHighlights);
router.get('/public/genres', movieController.listGenresPublic);
router.get('/public/featured', movieController.listFeaturedPublic);
router.get('/public', movieController.listMoviesPublic);
router.get('/public/:slug', movieController.getMoviePublicBySlug);

router.get('/genres', requireAdminOrUser, movieController.listGenres);
router.get('/featured', requireAdminOrUser, movieController.listFeatured);
router.get('/', requireAdminOrUser, movieController.listMovies);
router.get('/:slug', requireAdminOrUser, movieController.getMovieBySlug);

router.post('/', requireAdmin, movieController.createMovie);
router.post('/bulk', requireAdmin, movieController.bulkCreateMovies);
router.patch('/:id', requireAdmin, movieController.updateMovie);
router.delete('/:id', requireAdmin, movieController.deleteMovie);

module.exports = router;
