const express = require('express');
const router = express.Router();


const authController = require('../controllers/auth');


const userRoutes = require('./users');
const groupRoutes = require('./groups');
const artifactRoutes = require('./artifacts');
const missionRoutes = require('./missions');    
const anomalyRoutes = require('./anomalies');    
const intelligenceRoutes = require('./intelligence'); 
const vaultRoutes = require('./vaults');     
const containmentRoutes = require('./containment');
const { CheckAuth } = require('../middlewares/auth');


router.post('/login', authController.login);
router.post('/register', authController.register); 


router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/artifacts', artifactRoutes);
router.use('/missions', missionRoutes);     
router.use('/anomalies', anomalyRoutes);    
router.use('/intelligence', intelligenceRoutes); 


router.get('/admin/mission-logs', CheckAuth, async (req, res) => {
    try {
        const { AuditLog, User } = require('../models');
        const logs = await AuditLog.findAll({
            where: { action: 'MISSION_FINALIZED' },
            
            include: [{ 
                model: User, 
                as: 'author', 
                attributes: ['firstname', 'lastname'] 
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "LOG_ACCESS_DENIED" });
    }
});


router.post('/logout', CheckAuth, authController.logout);
router.use('/vaults', vaultRoutes);                // ADD THIS
router.use('/containment', containmentRoutes);

router.get('/ping', (req, res) => res.send('Chronos API Online'));


module.exports = router;