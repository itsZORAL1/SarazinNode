const { User, Device, Group } = require("../models");

// 1. GET ALL USERS 
async function listUsers(req, res) {
    try {
        const users = await User.findAll({
        
            include: [
                { model: Device, as: 'devices' }, // One-to-Many
                { model: Group, as: 'groups' }    // Many-to-Many
            ]
        });
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// 2. GET USER BY ID 
async function getUserById(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                { model: Device, as: 'devices' },
                { model: Group, as: 'groups' }
            ]
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// 3. CREATE USER 
async function createUser(req, res) {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// 4. UPDATE USER
async function updateUser(req, res) {
    try {
        const [updated] = await User.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) { res.status(500).send(error.message); }
}

// 5. DELETE USER
async function deleteUser(req, res) {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });
        deleted ? res.status(204).send() : res.status(404).send("User not found");
    } catch (error) { res.status(500).send(error.message); }
}


async function addUserToGroup(req, res) {
    try {
        const user = await User.findByPk(req.params.userId);
        const group = await Group.findByPk(req.params.groupId);

        if (!user || !group) {
            return res.status(404).send("User or Group not found");
        }

        // Sequelize magic method for Many-to-Many
        await user.addGroup(group); 
        
        res.status(200).send(`User ${user.firstname} added to Group ${group.name}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser, addUserToGroup };