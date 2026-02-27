// routes/missions.js
const express = require('express');
const router = express.Router();
const missionController = require('../controllers/mission');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');
const { Mission, Anomaly } = require('../models');

router.get('/', CheckAuth, async (req, res) => {
    try {
        const missions = await Mission.findAll({
            
            include: [{ 
                model: Anomaly, 
                as: 'anomaly' 
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(missions);
    } catch (err) {
        res.status(500).json({ message: "TEMPORAL_LINK_FAILURE" });
    }
});

router.post('/report', CheckAuth, CheckPermission('anomaly:write', 4), async (req, res) => {
    try {
        const anomaly = await Anomaly.create({
            location: req.body.location,
            type: req.body.description,
            severity: req.body.severity,
            timelineId: req.body.timelineId,
            
            status: req.body.isArtifactMission ? 'RECOVERY_REQUIRED' : 'OPEN'
        });

        await Mission.create({
            anomalyId: anomaly.id,
            status: 'IN_PROGRESS',
            directorId: req.user.id
        });

        res.status(201).json(anomaly);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id/finalize', CheckAuth, missionController.completeMission);

module.exports = router;