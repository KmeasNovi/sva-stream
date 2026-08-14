const express = require('express');
const userController = require('../controllers/userController');
const { requireUser, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.post('/google', authLimiter, userController.googleAuth);
router.post('/verify-email', userController.verifyEmail);
router.post('/resend-verification', authLimiter, userController.resendVerification);
router.post('/forgot-password', authLimiter, userController.forgotPassword);
router.post('/reset-password', authLimiter, userController.resetPassword);

router.get('/me', requireUser, userController.getMe);
router.post('/favorites/:movieId', requireUser, userController.addFavorite);
router.delete('/favorites/:movieId', requireUser, userController.removeFavorite);

// Módulo administrativo (/admin/dashboard/usuarios) — gestão de contas de
// usuário. Registradas depois de /me pra "me" nunca ser capturado por /:id.
router.get('/', requireAdmin, userController.adminListUsers);
router.post('/', requireAdmin, userController.adminCreateUser);
router.post('/bulk', requireAdmin, userController.adminBulkCreateUsers);
router.get('/:id', requireAdmin, userController.adminGetUser);
router.patch('/:id', requireAdmin, userController.adminUpdateUser);
router.delete('/:id', requireAdmin, userController.adminDeleteUser);

module.exports = router;
