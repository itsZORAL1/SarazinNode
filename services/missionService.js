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


async completeMission(missionId, user, body) {
    const { Mission, Anomaly, AuditLog, Artifact } = require('../models');
    
    const mission = await Mission.findByPk(missionId, {
        include: [{ model: Anomaly, as: 'anomaly' }] 
    });

    if (!mission) throw new Error("Mission not found.");

    await mission.update({ status: 'COMPLETED' });
    
    if (mission.anomaly) {
        const previousStatus = mission.anomaly.status;
        await mission.anomaly.update({ status: 'CLOSED' });

        
        if (previousStatus === 'RECOVERY_REQUIRED' && body.artifact) {
            await Artifact.create({
                name: body.artifact.name,
                serialNumber: body.artifact.serial, 
                originEra: mission.anomaly.location,
                dangerLevel: mission.anomaly.severity || 1,
                status: 'SECURED_IN_VAULT',
                vaultId: body.artifact.vaultId || 1, 
                anomalyId: mission.anomaly.id
            });
        }
    }

    await AuditLog.create({
        userId: user.id,
        action: 'MISSION_FINALIZED',
        targetId: `MISSION_${mission.id}`,
        details: `Timeline stabilized. ${body.artifact ? `Artifact [${body.artifact.name}] secured in Vault ${body.artifact.vaultId}.` : 'No artifact recovery required.'}`,
        ipAddress: 'INTERNAL_SYSTEM'
    });

    return { message: "Mission finalized successfully." };
}
}

module.exports = new MissionService();