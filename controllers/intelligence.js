const IntelligenceService = require('../services/intelligenceService');

async function getAgencyStats(req, res) {
    try {
        // We call the service instead of doing Artifact.count() here
        const data = await IntelligenceService.getAgencyOverview();
        
        res.status(200).json(data);
    } catch (error) {
        // If the service fails, we catch it here
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAgencyStats };