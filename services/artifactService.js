const { Artifact, Vault, AuditLog } = require("../models");
const { Op } = require('sequelize');

class ArtifactService {
    
    async getArtifactsForUser(userClearance) {
        return await Artifact.findAll({
            where: {
                dangerLevel: { [Op.lte]: userClearance }
            },
            include: [{ model: Vault, as: 'vault' }]
        });
    }
// services/artifactService.js
// services/artifactService.js
async searchArtifacts(filters) {
    const { era, danger, status } = filters;
    let whereClause = {};

    // 1. DUAL SEARCH LOGIC: Search name OR era if 'era' param is provided
    if (era) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${era}%` } },
            { originEra: { [Op.iLike]: `%${era}%` } }
        ];
    }

    // 2. Add other filters if they exist
    if (danger) whereClause.dangerLevel = danger;
    if (status) whereClause.status = status;

    return await Artifact.findAll({ 
        where: whereClause,
        include: [{ model: Vault, as: 'vault' }] 
    });
}
    async getById(id) {
        return await Artifact.findByPk(id, {
            include: [{ model: Vault, as: 'vault' }]
        });
    }

    async ingestArtifact(data, user, ip, userAgent) {
        const artifact = await Artifact.create(data);
        
        // Automated Security Audit
        await AuditLog.create({
            userId: user.id,
            action: 'CREATE_ARTIFACT',
            targetId: `ARTIFACT_${artifact.id}`,
            details: `New artifact [${artifact.name}] ingested into the Archive.`,
            ipAddress: ip,
            userAgent: userAgent
        });

        return artifact;
    }
     
    async removeArtifact(id) {
        const artifact = await Artifact.findByPk(id);
        if (artifact) await artifact.destroy();
        return artifact;
    }
}

module.exports = new ArtifactService();