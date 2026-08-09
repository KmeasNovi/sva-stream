const express = require('express');
const movieController = require('../controllers/movieController');
const { requireAdmin, requireAdminOrUser } = require('../middleware/auth');

const router = express.Router();

router.get('/genres', requireAdminOrUser, movieController.listGenres);
router.get('/featured', requireAdminOrUser, movieController.listFeatured);
router.get('/', requireAdminOrUser, movieController.listMovies);
router.get('/:slug', requireAdminOrUser, movieController.getMovieBySlug);

router.post('/', requireAdmin, movieController.createMovie);
router.patch('/:id', requireAdmin, movieController.updateMovie);
router.delete('/:id', requireAdmin, movieController.deleteMovie);

module.exports = router;
