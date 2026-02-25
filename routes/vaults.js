const express = require('express');
const router = express.Router();
const { Vault } = require('../models');
const { CheckAuth, CheckClearance } = require('../middlewares/auth'); 

router.post('/', CheckAuth, CheckClearance(4), async (req, res) => {
    try {
        const vault = await Vault.create(req.body);
        res.status(201).json(vault);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;