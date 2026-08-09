const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/subscribe', authLimiter, newsletterController.subscribe);

module.exports = router;
