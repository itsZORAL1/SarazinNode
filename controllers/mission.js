const MissionService = require('../services/missionService');

async function assignMission(req, res) {
    try {
        const { agentId, anomalyId } = req.body;
        const directorId = req.user.id; 

        const mission = await MissionService.assignMission(agentId, anomalyId, directorId);
        res.status(201).json({ message: "Agent deployed to timeline.", mission });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


async function completeMission(req, res) {
    try {
        const { id } = req.params;
     
        const result = await MissionService.completeMission(id, req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { assignMission, completeMission };