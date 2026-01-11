const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const groupRoutes = require('./groups');
const deviceRoutes = require('./devices');

// Directing traffic to the specific resource routes
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/devices', deviceRoutes);

module.exports = router;