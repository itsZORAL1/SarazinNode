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

    // decoded should contain the user's id and clearance level
    req.user = decoded; 
    next();
};

// ADD THIS: The missing function that caused the crash
const CheckClearance = (level) => {
    return (req, res, next) => {
        // We check req.user.clearance (populated by CheckAuth above)
        if (!req.user || req.user.clearance < level) {
            return res.status(403).json({ 
                error: "INSUFFICIENT_CLEARANCE", 
                message: `This operation requires Level ${level} clearance.` 
            });
        }
        next();
    };
};

module.exports = { 
    CheckAuth, 
    CheckClearance 
};