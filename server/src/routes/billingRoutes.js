const express = require('express');
const billingController = require('../controllers/billingController');
const { requireUser } = require('../middleware/auth');

const router = express.Router();

router.post('/subscribe', requireUser, billingController.subscribe);
// Sem requireUser — quem chama é o Asaas, autenticado pelo token de webhook (ver controller).
router.post('/webhook', billingController.webhook);

module.exports = router;
