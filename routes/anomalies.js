const express = require('express');
const router = express.Router();
const anomalyController = require('../controllers/anomaly'); // Check your controller filename!
const { CheckPermission } = require('../middlewares/perm');
const { CheckAuth, CheckClearance } = require('../middlewares/auth');


router.post('/report', CheckAuth, CheckPermission('anomaly:write', 4), anomalyController.reportAnomaly);

router.put('/:id/resolve', CheckAuth, CheckClearance(4), async (req, res) => {
    try {
        const { Anomaly } = require('../models');
        const anomaly = await Anomaly.findByPk(req.params.id);
        
        if (!anomaly) return res.status(404).json({ message: "Anomaly not found" });

      
        await anomaly.update({ status: 'CLOSED' });
        
        res.json({ message: "TIMELINE REPAIRED", stability_gain: 10 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;