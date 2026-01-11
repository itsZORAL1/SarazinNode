const { Group, User } = require("../models");

async function listGroups(req, res) {
    try {
        const groups = await Group.findAll({
            // (Many-to-Many)
            include: [{ model: User, as: 'users' }]
        });
        res.status(200).json(groups);
    } catch (error) { res.status(500).send(error.message); }
}

async function createGroup(req, res) {
    try {
        const group = await Group.create(req.body);
        res.status(201).json(group);
    } catch (error) { res.status(400).send(error.message); }
}

module.exports = { listGroups, createGroup };