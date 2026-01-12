const jwtService = require('../services/jwt');
const { Session } = require('../models'); 

const CheckAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

  
    const session = await Session.findOne({ where: { token } });
    if (!session) {
        return res.status(401).json({ message: "Session expired or logged out" });
    }

    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; 
    next();
};

module.exports = { CheckAuth };