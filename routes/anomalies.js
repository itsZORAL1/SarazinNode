const express = require('express');
const router = express.Router();
const anomalyController = require('../controllers/anomaly'); // Check your controller filename!
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// Route to report a new temporal anomaly (Level 4 clearance)
router.post('/report', CheckAuth, CheckPermission('anomaly:write', 4), anomalyController.reportAnomaly);

module.exports = router;