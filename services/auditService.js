async function getMissionLogs() {
    return await AuditLog.findAll({
        where: { action: 'MISSION_FINALIZED' },
        include: [{ model: User, as: 'author', attributes: ['firstname', 'email'] }],
        order: [['createdAt', 'DESC']]
    });
}