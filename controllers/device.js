const { Device, User } = require("../models");

async function listDevices(req, res) {
    try {
        const devices = await Device.findAll({
     
            include: [{ model: User }] 
        });
        res.status(200).json(devices);
    } catch (error) { 
        res.status(500).send(error.message); 
    }
}

async function createDevice(req, res) {
    try {
        // "userId" link it to a user
        const device = await Device.create(req.body);
        res.status(201).json(device);
    } catch (error) { res.status(400).send(error.message); }
}

module.exports = { listDevices, createDevice };