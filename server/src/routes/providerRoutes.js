const express = require('express');
const providerLeadController = require('../controllers/providerLeadController');
const { requireAdmin } = require('../middleware/auth');
const { leadLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Público — formulário de flyer.sepiastream.com/contratar.
router.post('/leads', leadLimiter, providerLeadController.createLead);

router.get('/leads', requireAdmin, providerLeadController.adminListLeads);
router.patch('/leads/:id', requireAdmin, providerLeadController.adminUpdateLead);

module.exports = router;
