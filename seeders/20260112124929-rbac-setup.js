'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // required permissions
    const permissionsList = [
      { scope: 'user:read' }, { scope: 'user:write' }, { scope: 'user:delete' },
      { scope: 'device:read' }, { scope: 'device:write' }, { scope: 'device:delete' },
      { scope: 'self:read' }, { scope: 'me:write' },
      { scope: 'session:read' }, { scope: 'session:write' }, { scope: 'session:delete' },
      { scope: 'group:read' }, { scope: 'group:write' }, { scope: 'group:delete' },
      { scope: 'group:request' }
    ];

    await queryInterface.bulkInsert('Permissions', permissionsList.map(p => ({
      ...p, createdAt: new Date(), updatedAt: new Date()
    })));

    // Groups
    const groupsList = [
      { name: 'Admin' }, { name: 'UserStandard' }, { name: 'UserManager' },
      { name: 'Guest' }, { name: 'DeviceManager' }
    ];

    await queryInterface.bulkInsert('Groups', groupsList.map(g => ({
      ...g, createdAt: new Date(), updatedAt: new Date()
    })));

    // Getting IDs to link them in GroupPermissions
    const [permissions] = await queryInterface.sequelize.query('SELECT id, scope FROM "Permissions";');
    const [groups] = await queryInterface.sequelize.query('SELECT id, name FROM "Groups";');

    const findP = (scope) => permissions.find(p => p.scope === scope).id;
    const findG = (name) => groups.find(g => g.name === name).id;

    const groupPermissions = [];

    // Mapping Logic
    const adminId = findG('Admin');
    permissions.forEach(p => groupPermissions.push({ groupId: adminId, permissionId: p.id }));

    // UserManager Mapping
    const userMgrId = findG('UserManager');
    ['user:read', 'user:write', 'user:delete', 'group:read'].forEach(s => 
      groupPermissions.push({ groupId: userMgrId, permissionId: findP(s) }));

    // DeviceManager Mapping
    const devMgrId = findG('DeviceManager');
    ['device:read', 'device:write', 'device:delete'].forEach(s => 
      groupPermissions.push({ groupId: devMgrId, permissionId: findP(s) }));

    // UserStandard Mapping
    const stdId = findG('UserStandard');
    ['self:read', 'me:write', 'device:read', 'session:read'].forEach(s => 
      groupPermissions.push({ groupId: stdId, permissionId: findP(s) }));

    // Guest Mapping
    const guestId = findG('Guest');
    ['self:read', 'device:read'].forEach(s => 
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