const IntelligenceService = require('../services/intelligenceService');

async function getAgencyStats(req, res) {
    try {
        
        const data = await IntelligenceService.getAgencyOverview();
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAgencyStats };