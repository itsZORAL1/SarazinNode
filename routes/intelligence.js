const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligence');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// Only Level 5 Clearance can see the full Agency Dashboard
router.get('/overview', CheckAuth, CheckPermission('anomaly:read', 5), intelligenceController.getAgencyStats);

module.exports = router;