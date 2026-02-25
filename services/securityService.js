const { User, Group, Permission, Session, Device } = require('../models');

class SecurityService {
    async validateSession(token, deviceFingerprint) {
        // 1. Logic: Anti-Hijacking. Ensure session belongs to the hardware device
        const session = await Session.findOne({ 
            where: { token, deviceFingerprint },
            include: [User] 
        });

        if (!session) throw new Error("Security Breach: Session/Device mismatch detected.");
        return session.User;
    }

    async calculatePermissions(userId) {
        // 2. Logic: Aggregate permissions from all groups a user belongs to
        const user = await User.findByPk(userId, {
            include: [{
                model: Group,
                include: [Permission]
            }]
        });

        const permissions = new Set();
        user.Groups.forEach(group => {
            group.Permissions.forEach(p => permissions.add(p.name));
        });

        return Array.from(permissions);
    }
}

module.exports = new SecurityService();