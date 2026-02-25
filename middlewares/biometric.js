// middlewares/biometric.js
const models = require('../models');

module.exports = async (req, res, next) => {
    try {
        const scan = req.headers['x-biometric-scan'];
        
        if (!scan) {
            return res.status(403).json({ error: "BIOMETRIC_REQUIRED", message: "Retina scan required." });
        }

        // Use models.BiometricKey to ensure we are accessing the exported object
        if (!models.BiometricKey) {
            throw new Error("BiometricKey model is not loaded in models/index.js");
        }

        const key = await models.BiometricKey.findOne({ 
            where: { 
                userId: req.user.id, 
                keyHash: scan 
            } 
        });

        if (!key) {
            return res.status(401).json({ error: "ACCESS_DENIED", message: "Biometric mismatch." });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};