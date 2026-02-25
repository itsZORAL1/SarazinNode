const express = require('express');
const router = express.Router();
const missionController = require('../controllers/mission');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// Route to Start a Mission
router.post('/assign', CheckAuth, CheckPermission('mission:write', 4), missionController.assignMission);

// Route to Finish a Mission
router.put('/:id/complete', CheckAuth, CheckPermission('mission:write', 4), missionController.completeMission);

module.exports = router;