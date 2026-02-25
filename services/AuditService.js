const { AuditLog } = require('../models');

class AuditService {
    async logSecurityEvent(req, action, details) {
        return await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action,
            targetId: 'SYSTEM',
            details,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }
}
module.exports = new AuditService();