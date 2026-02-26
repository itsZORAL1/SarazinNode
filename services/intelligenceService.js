const { Artifact, Mission, Anomaly, Vault } = require('../models');

class IntelligenceService {
    async getAgencyOverview() {
        const artifactsCount = await Artifact.count();
        const missionsCount = await Mission.count({ where: { status: 'IN_PROGRESS' } });
        const anomaliesCount = await Anomaly.count({ where: { status: 'OPEN' } });
        
        let riskStatus = "STABLE";
        let securityNotice = null;

        // --- DYNAMIC RISK LOGIC ---
        if (anomaliesCount > 0 && anomaliesCount <= 2) {
            riskStatus = "STABLE";
        } else if (anomaliesCount > 2 && anomaliesCount <= 5) {
            riskStatus = "ELEVATED";
            securityNotice = "CAUTION: Multiple temporal disturbances detected.";
        } else if (anomaliesCount > 5) {
            riskStatus = "CRITICAL";
            // The New Security Warning
            securityNotice = "PROTOCOL ZERO INITIATED: Temporal stability below threshold. All agents report for extraction.";
        }

        const vaults = await Vault.findAll({
            include: [{ model: Artifact, as: 'artifacts' }]
        });

        return {
            agencyStatus: riskStatus,
            securityNotice: securityNotice, 
            metrics: {
                totalArtifacts: artifactsCount,
                activeMissions: missionsCount,
                unresolvedAnomalies: anomaliesCount
            },
            vaults: vaults.map(v => ({
                name: v.locationName,
                capacity: `${v.artifacts ? v.artifacts.length : 0}/${v.maxCapacity}`,
                loadPercent: v.maxCapacity > 0 ? Math.round(((v.artifacts ? v.artifacts.length : 0) / v.maxCapacity) * 100) : 0
            }))
        };
    }
}

module.exports = new IntelligenceService();