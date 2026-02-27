const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligence');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');


router.get('/overview', CheckAuth, CheckPermission('anomaly:read', 5), intelligenceController.getAgencyStats);

module.exports = router;