// Update the first line to include sequelize
const { Mission, Anomaly, AuditLog, sequelize } = require('../models'); 

class MissionService {
    async assignMission(agentId, anomalyId, directorId) {
        const mission = await Mission.create({
            agentId,
            anomalyId,
            directorId,
            status: 'IN_PROGRESS'
        });

        await Anomaly.update(
            { status: 'UNDER_INVESTIGATION' }, 
            { where: { id: anomalyId } }
        );

        return mission;
    }

async completeMission(missionId, user) {
        const mission = await Mission.findByPk(missionId, {
            include: [{ model: Anomaly, as: 'anomaly' }] 
        });

        if (!mission) throw new Error("Mission not found.");

        await mission.update({ status: 'COMPLETED' });
        
        if (mission.anomaly) {
            await mission.anomaly.update({ status: 'CLOSED' });
        }

        // BACK TO STANDARD SEQUELIZE CODE
        await AuditLog.create({
            userId: user.id,
            action: 'MISSION_FINALIZED',
            targetId: `MISSION_${mission.id}`,
            details: `Timeline stabilized. Anomaly at ${mission.anomaly?.location || 'Unknown'} resolved.`,
            ipAddress: 'INTERNAL_SYSTEM'
        });

        return { message: "Mission finalized and timeline stabilized." };
    }
}

module.exports = new MissionService();