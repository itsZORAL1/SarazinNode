const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device');

router.get('/', deviceController.listDevices);
router.post('/', deviceController.createDevice);

module.exports = router;