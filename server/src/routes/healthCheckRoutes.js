const express = require('express');
const healthCheckController = require('../controllers/healthCheckController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/start', requireAdmin, healthCheckController.startCheck);
router.get('/:jobId', requireAdmin, healthCheckController.getCheckStatus);
router.get('/:jobId/csv', requireAdmin, healthCheckController.downloadCheckCsv);

module.exports = router;
