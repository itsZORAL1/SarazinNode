const express = require('express');
const router = express.Router();

// 1. Import Controllers
const authController = require('../controllers/auth');

// 2. Import Sub-Routers
const userRoutes = require('./users');
const groupRoutes = require('./groups');
const artifactRoutes = require('./artifacts'); // Renamed from deviceRoutes

// 3. Define Middlewares
const { CheckAuth } = require('../middlewares/auth');

// --- PUBLIC ROUTES ---
// Accessible at POST http://localhost:3000/api/login
router.post('/login', authController.login);
router.post('/register', authController.register); 

// --- PROTECTED ROUTES ---
// These are prefixed and require valid JWTs
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/artifacts', artifactRoutes); // Updated endpoint path to /artifacts

// --- LOGOUT ---
router.post('/logout', CheckAuth, authController.logout);

// Sanity Check Route
router.get('/ping', (req, res) => res.send('Chronos API Online'));

module.exports = router;