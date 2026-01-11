const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

router.get('/', groupController.listGroups);
router.post('/', groupController.createGroup);

module.exports = router;