const express = require('express');
const healthCheckController = require('../controllers/healthCheckController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/start', requireAdmin, healthCheckController.startCheck);
router.get('/:jobId', requireAdmin, healthCheckController.getCheckStatus);
router.get('/:jobId/csv', requireAdmin, healthCheckController.downloadCheckCsv);

router.post('/fix/start', requireAdmin, healthCheckController.startFix);
router.get('/fix/:jobId', requireAdmin, healthCheckController.getFixStatus);
router.get('/fix/:jobId/csv', requireAdmin, healthCheckController.downloadFixCsv);

module.exports = router;
