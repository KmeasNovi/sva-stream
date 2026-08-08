const express = require('express');
const userController = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);

router.get('/me', requireUser, userController.getMe);
router.post('/favorites/:movieId', requireUser, userController.addFavorite);
router.delete('/favorites/:movieId', requireUser, userController.removeFavorite);

module.exports = router;
