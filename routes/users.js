const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');


router.get('/me', CheckAuth, userController.getMe); 
router.get('/:id', CheckAuth, userController.getUserById);
router.get('/', CheckAuth, CheckPermission('user:read'), userController.listUsers);     // GET /users
router.get('/:id', CheckAuth, userController.getUserById);    // GET /users/:id
router.post('/', CheckAuth, CheckPermission('group:write'), userController.createUser);     // POST /users
router.put('/:id', CheckAuth, userController.updateUser);     // PUT /users/:id
router.delete('/:id', CheckAuth, CheckPermission('user:delete'), userController.deleteUser);  // DELETE /users/:id
router.post('/:userId/groups/:groupId', CheckAuth, userController.addUserToGroup); // Link a user (ID) to a group (ID)

module.exports = router;



