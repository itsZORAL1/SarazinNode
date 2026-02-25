const express = require('express');
const router = express.Router();

// 1. Import Controllers
const authController = require('../controllers/auth');

// 2. Import Sub-Routers
const userRoutes = require('./users');
const groupRoutes = require('./groups');
const artifactRoutes = require('./artifacts');
const missionRoutes = require('./missions');    // ADD THIS
const anomalyRoutes = require('./anomalies');    // ADD THIS
const intelligenceRoutes = require('./intelligence'); // ADD THIS
const vaultRoutes = require('./vaults');           // ADD THIS
const containmentRoutes = require('./containment');

// 3. Define Middlewares
const { CheckAuth } = require('../middlewares/auth');

// --- PUBLIC ROUTES ---
router.post('/login', authController.login);
router.post('/register', authController.register); 

// --- PROTECTED ROUTES ---
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/artifacts', artifactRoutes);
router.use('/missions', missionRoutes);     // ADD THIS
router.use('/anomalies', anomalyRoutes);    // ADD THIS
router.use('/intelligence', intelligenceRoutes); // ADD THIS

// --- LOGOUT ---
router.post('/logout', CheckAuth, authController.logout);
router.use('/vaults', vaultRoutes);                // ADD THIS
router.use('/containment', containmentRoutes);

router.get('/ping', (req, res) => res.send('Chronos API Online'));

module.exports = router;