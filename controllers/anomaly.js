const AnomalyService = require('../services/anomalyService');

async function reportAnomaly(req, res) {
    try {
        const anomaly = await AnomalyService.detectAnomaly(req.body);
        res.status(201).json(anomaly);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { reportAnomaly };