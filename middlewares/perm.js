const CheckPermission = (requiredScope, minClearance = 1) => {
    return (req, res, next) => {
        // req.user is populated by your CheckAuth middleware from the JWT
        const userScopes = req.user.scopes || [];
        const userClearance = req.user.clearanceLevel || 0;

        // 1. Vertical Security: Check Clearance Level
        if (userClearance < minClearance) {
            return res.status(403).json({ 
                message: `CLASSIFIED: This resource requires Level ${minClearance} clearance. You are Level ${userClearance}.` 
            });
        }

        // 2. Horizontal Security: Check Scopes
        const hasScope = userScopes.includes(requiredScope) || userScopes.includes('*');

        if (!hasScope) {
            return res.status(403).json({ 
                message: `ACCESS DENIED: Missing required scope [${requiredScope}].` 
            });
        }

        next();
    };
};

module.exports = { CheckPermission };