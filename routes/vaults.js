const express = require('express');
const router = express.Router();
const missionController = require('../controllers/mission');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');
const { Mission, Vault, Artifact } = require('../models'); 

router.get('/', CheckAuth, async (req, res) => {
    try {
        const vaults = await Vault.findAll({
            
            include: [{ 
                model: Artifact, 
                as: 'artifacts' 
            }],
            order: [['id', 'ASC']]
        });
        res.json(vaults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "VAULT_LINK_FAILURE" });
    }
});


router.post('/assign', CheckAuth, CheckPermission('mission:write', 4), missionController.assignMission);


router.put('/:id/complete', CheckAuth, CheckPermission('mission:write', 4), missionController.completeMission);

module.exports = router;