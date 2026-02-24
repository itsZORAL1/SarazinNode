const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// Self-service (Low clearance)
router.get('/me', CheckAuth, userController.getMe); 

// Management routes (Requires specific scopes and higher clearance)
router.get('/', CheckAuth, CheckPermission('user:read', 4), userController.listUsers);
router.get('/:id', CheckAuth, CheckPermission('user:read', 4), userController.getUserById);

router.post('/', CheckAuth, CheckPermission('user:write', 5), userController.createUser);
router.put('/:id', CheckAuth, CheckPermission('user:write', 4), userController.updateUser);
router.delete('/:id', CheckAuth, CheckPermission('user:delete', 5), userController.deleteUser);

// Agency specific logic: Assigning agents to groups
router.post('/:userId/groups/:groupId', CheckAuth, CheckPermission('group:write', 4), userController.addUserToGroup);

module.exports = router;