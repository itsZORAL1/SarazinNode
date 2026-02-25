const ContainmentService = require('../services/containmentService');

exports.runSafetySweep = async (req, res) => {
    try {
        const { vaultId } = req.params;
        const result = await ContainmentService.checkVaultIntegrity(vaultId);
        
        res.json({
            timestamp: new Date().toISOString(),
            vaultId: vaultId,
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};