const { User, Session, Group, Permission } = require('../models');
const jwtService = require('../services/jwt'); 
const bcrypt = require('bcryptjs');


async function login(req, res) {
    try {
        const { email, password } = req.body; 

        const foundUser = await User.findOne({ 
            where: { email },
            include: [{
                model: Group,
                as: 'groups',
                include: [{ model: Permission, as: 'permissions' }]
            }]
        });

        
        if (!foundUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (foundUser.accountStatus !== 'Active') {
            return res.status(403).json({ message: `Access Denied: Account is ${foundUser.accountStatus}` });
        }

       
        const scopes = [];
        foundUser.groups.forEach(group => {
            group.permissions.forEach(p => scopes.push(p.scope));
        });
        const uniqueScopes = [...new Set(scopes)];

        
        const token = jwtService.generateAccessToken({
            id: foundUser.id,
            email: foundUser.email,
            clearanceLevel: foundUser.clearanceLevel,
            scopes: uniqueScopes
        });
        
        
        await Session.create({
            token: token,
            userId: foundUser.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        });

        res.status(200).json({ 
            message: "Welcome to the Archive, Agent.", 
            token, 
            clearance: foundUser.clearanceLevel
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Internal Temporal Error" });
    }
}


async function register(req, res) {
    try {
        const { password, ...userData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ ...userData, password: hashedPassword });
        res.status(201).json({ id: user.id, email: user.email });
        
        if (user.clearanceLevel === 5) {
            const council = await Group.findOne({ where: { name: 'O5-Council' } });
            if (council) await user.addGroup(council);
        } else {
            const guest = await Group.findOne({ where: { name: 'TemporalGuest' } });
            if (guest) await user.addGroup(guest);
        }

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
        res.status(200).json({ message: "Session terminated. Safe travels through time." });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = { login, register, logout };