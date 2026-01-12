const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 


const generateAccessToken = (payload) => {
    return jwt.sign(
        payload, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    verifyAccessToken
};