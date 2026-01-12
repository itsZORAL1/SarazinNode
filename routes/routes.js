const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const groupRoutes = require('./groups');
const deviceRoutes = require('./devices');
const authController = require('../controllers/auth');
const { CheckAuth } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register); 
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/devices', deviceRoutes);
router.post('/logout', CheckAuth, authController.logout);

module.exports = router;