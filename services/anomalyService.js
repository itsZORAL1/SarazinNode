const { Anomaly, Timeline, Artifact } = require('../models');

class AnomalyService {
    async detectAnomaly(anomalyData) {
       
        const timeline = await Timeline.findByPk(anomalyData.timelineId);
        if (!timeline) throw new Error("Target Timeline does not exist. Anomaly cannot be anchored.");

        return await Anomaly.create(anomalyData);
    }

    async mapArtifactToAnomaly(artifactId, anomalyId) {
        const artifact = await Artifact.findByPk(artifactId);
        const anomaly = await Anomaly.findByPk(anomalyId, { include: [Timeline] });

       
        if (!artifact.originEra.includes(anomaly.Timeline.eraName.split(' ')[0])) {
            console.warn("Temporal Mismatch: Artifact origin era does not align perfectly with Anomaly Timeline.");
        }

        return await artifact.update({ anomalyId });
    }
}

module.exports = new AnomalyService();