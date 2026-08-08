const express = require('express');
const movieController = require('../controllers/movieController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/genres', movieController.listGenres);
router.get('/featured', movieController.listFeatured);
router.get('/', movieController.listMovies);
router.get('/:slug', movieController.getMovieBySlug);

router.post('/', requireAdmin, movieController.createMovie);
router.patch('/:id', requireAdmin, movieController.updateMovie);
router.delete('/:id', requireAdmin, movieController.deleteMovie);

module.exports = router;
