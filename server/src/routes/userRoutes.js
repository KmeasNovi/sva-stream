const express = require('express');
const userController = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.post('/verify-email', userController.verifyEmail);
router.post('/resend-verification', authLimiter, userController.resendVerification);

router.get('/me', requireUser, userController.getMe);
router.post('/favorites/:movieId', requireUser, userController.addFavorite);
router.delete('/favorites/:movieId', requireUser, userController.removeFavorite);

module.exports = router;
