const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.listUsers);           // GET /users
router.get('/:id', userController.getUserById);      // GET /users/:id
router.post('/', userController.createUser);         // POST /users
router.put('/:id', userController.updateUser);       // PUT /users/:id
router.delete('/:id', userController.deleteUser);    // DELETE /users/:id
router.post('/:userId/groups/:groupId', userController.addUserToGroup); // Link a user (ID) to a group (ID)
module.exports = router;