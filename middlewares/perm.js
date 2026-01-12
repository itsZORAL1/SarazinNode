const CheckPermission = (requiredScope) => {
    return (req, res, next) => {
       
        const userScopes = req.user.scopes || [];


        if (userScopes.includes('admin') || userScopes.includes(requiredScope)) {
            return next();
        }

        return res.status(403).json({ 
            message: `Access Denied. Required scope: ${requiredScope}` 
        });
    };
};

module.exports = { CheckPermission };