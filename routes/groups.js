const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

router.get('/', CheckAuth, CheckPermission('group:read'), groupController.listGroups);
router.post('/', CheckAuth, CheckPermission('group:write'), groupController.createGroup);
router.delete('/:id', CheckAuth, CheckPermission('group:delete'), groupController.deleteGroup);

module.exports = router;