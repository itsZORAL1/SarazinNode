const express = require('express');
const router = express.Router();
const containmentController = require('../controllers/containmentController');
const biometricCheck = require('../middlewares/biometric');
const { CheckAuth, CheckClearance } = require('../middlewares/auth');

router.post('/vaults/:vaultId/sweep', CheckAuth, CheckClearance(4), async (req, res) => {
    try {
        const result = await require('../services/containmentService').checkVaultIntegrity(req.params.vaultId);
        res.json({
            timestamp: new Date().toISOString(),
            vaultId: req.params.vaultId,
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/incidents/:id/resolve', CheckAuth, CheckClearance(4), biometricCheck, async (req, res) => {
    const { IncidentReport } = require('../models');
    const report = await IncidentReport.findByPk(req.params.id);
    await report.update({ status: 'RESOLVED' });
    res.json({ message: "Incident resolved via Biometric Override." });
});

module.exports = router;

