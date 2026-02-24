'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Updated permissions to match Chronos Archive theme
    const permissionsList = [
      { scope: 'user:read' }, { scope: 'user:write' }, { scope: 'user:delete' },
      { scope: 'artifact:read' }, { scope: 'artifact:write' }, { scope: 'artifact:delete' }, // Replaced 'device'
      { scope: 'anomaly:read' }, { scope: 'anomaly:write' }, { scope: 'anomaly:delete' },    // New: Time Rips
      { scope: 'mission:read' }, { scope: 'mission:write' },                                // New: Operations
      { scope: 'self:read' }, { scope: 'me:write' },
      { scope: 'session:read' }, { scope: 'session:write' }, { scope: 'session:delete' },
      { scope: 'group:read' }, { scope: 'group:write' }, { scope: 'group:delete' }
    ];

    await queryInterface.bulkInsert('Permissions', permissionsList.map(p => ({
      ...p, createdAt: new Date(), updatedAt: new Date()
    })));

    // Groups renamed to Agency Departments
    const groupsList = [
      { name: 'O5-Council' },      // Was Admin
      { name: 'Archivist' },       // Was UserManager
      { name: 'FieldAgent' },      // Was DeviceManager
      { name: 'Researcher' },      // Was UserStandard
      { name: 'TemporalGuest' }    // Was Guest
    ];

    await queryInterface.bulkInsert('Groups', groupsList.map(g => ({
      ...g, createdAt: new Date(), updatedAt: new Date()
    })));

    const [permissions] = await queryInterface.sequelize.query('SELECT id, scope FROM "Permissions";');
    const [groups] = await queryInterface.sequelize.query('SELECT id, name FROM "Groups";');

    const findP = (scope) => permissions.find(p => p.scope === scope).id;
    const findG = (name) => groups.find(g => g.name === name).id;

    const groupPermissions = [];

    // 1. O5-Council (Full Access)
    const adminId = findG('O5-Council');
    permissions.forEach(p => groupPermissions.push({ groupId: adminId, permissionId: p.id }));

    // 2. Archivist (Personnel & Mission Management)
    const archivistId = findG('Archivist');
    ['user:read', 'user:write', 'group:read', 'mission:read', 'artifact:read'].forEach(s => 
      groupPermissions.push({ groupId: archivistId, permissionId: findP(s) }));

    // 3. FieldAgent (Recovery Operations)
    const agentId = findG('FieldAgent');
    ['artifact:read', 'artifact:write', 'anomaly:read', 'mission:read', 'mission:write'].forEach(s => 
      groupPermissions.push({ groupId: agentId, permissionId: findP(s) }));

    // 4. Researcher (Data Analysis)
    const researcherId = findG('Researcher');
    ['self:read', 'me:write', 'artifact:read', 'anomaly:read', 'session:read'].forEach(s => 
      groupPermissions.push({ groupId: researcherId, permissionId: findP(s) }));

    // 5. TemporalGuest (Restricted View)
    const guestId = findG('TemporalGuest');
    ['self:read', 'artifact:read'].forEach(s => 
      groupPermissions.push({ groupId: guestId, permissionId: findP(s) }));

    await queryInterface.bulkInsert('GroupPermissions', groupPermissions.map(gp => ({
      ...gp, createdAt: new Date(), updatedAt: new Date()
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GroupPermissions', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};