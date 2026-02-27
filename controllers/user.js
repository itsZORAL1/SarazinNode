const { User, Device, Group } = require("../models");


async function listUsers(req, res) {
    try {
        const users = await User.findAll({
        
            include: [
                { model: Group, as: 'groups' }   
            ]
        });
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

 
async function getUserById(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
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


async function createUser(req, res) {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


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

        
        await user.addGroup(group); 
        
        res.status(200).send(`User ${user.firstname} added to Group ${group.name}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


async function getMe(req, res) {
    try {
  
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Group,
                as: 'groups',
                include: ['permissions']
            }]
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser, addUserToGroup , getMe };