const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

router.get('/', CheckAuth, CheckPermission('device:read'), deviceController.listDevices);
router.post('/', CheckAuth, CheckPermission('device:write'), deviceController.createDevice);

module.exports = router;