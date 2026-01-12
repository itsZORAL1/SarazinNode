const { User, Session, Group, Permission } = require('../models');
const jwtService = require('../services/jwt'); 

async function login(req, res) {
    try {
        const { email } = req.body; 

        // 1. Fetch user FIRST 
        const foundUser = await User.findOne({ 
            where: { email },
            include: [{
                model: Group,
                as: 'groups',
                include: [{
                    model: Permission,
                    as: 'permissions'
                }]
            }]
        });

        // 2. Check if user exists
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Extract scopes AFTER foundUser is defined
        const scopes = [];
        if (foundUser.groups) {
            foundUser.groups.forEach(group => {
                if (group.permissions) {
                    group.permissions.forEach(p => scopes.push(p.scope));
                }
            });
        }
        const uniqueScopes = [...new Set(scopes)];

        // 4. Generate token
        const token = jwtService.generateAccessToken({
            id: foundUser.id,
            email: foundUser.email,
            scopes: uniqueScopes
        });
        
        // 5. Create Session
        await Session.create({
            token: token,
            userId: foundUser.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        });

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { 
                id: foundUser.id, 
                firstname: foundUser.firstname, 
                email: foundUser.email 
            },
            scopes: uniqueScopes
        });
    } catch (error) {
        console.error("DEBUG LOGIN ERROR:", error);
        res.status(500).send(error.message);
    }
}
async function register(req, res) {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}



async function logout(req, res) {
    try {
     
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }


        await Session.destroy({ where: { token: token } });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { login, register, logout };