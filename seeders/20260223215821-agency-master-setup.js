'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    
    const timelines = await queryInterface.bulkInsert('Timelines', [{
      name: 'Prime Timeline (Mainline)',
      stabilityIndex: 100,
      isPruned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

    
    await queryInterface.bulkInsert('Vaults', [{
      locationName: 'Sector-7 Alpha-Vault',
      securityProtocol: 'Lead-Lined Quantum Shielding',
      maxCapacity: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    
    const hashedPassword = await bcrypt.hash('chronos2026', 10);
    const users = await queryInterface.bulkInsert('Users', [{
      firstname: 'Director',
      lastname: 'Chronos',
      email: 'admin@chronos.agency',
      password: hashedPassword,
      clearanceLevel: 5,
      accountStatus: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

   
const [guestGroup] = await queryInterface.sequelize.query(
  `SELECT id FROM "Groups" WHERE name = 'TemporalGuest' LIMIT 1;`
);

const [traineeUser] = await queryInterface.sequelize.query(
  `SELECT id FROM "Users" WHERE email = 'trainee@chronos.agency' LIMIT 1;`
);

if (guestGroup[0] && traineeUser[0]) {
  await queryInterface.bulkInsert('UserGroups', [{
    userId: traineeUser[0].id,
    groupId: guestGroup[0].id,
    createdAt: new Date(),
    updatedAt: new Date()
  }]);
}

    
const [groups] = await queryInterface.sequelize.query(
  `SELECT id FROM "Groups" WHERE name = 'O5-Council' LIMIT 1;` 
);
    if (groups.length > 0) {
      
      const userId = (users[0].id) ? users[0].id : users[0]; 
      
      await queryInterface.bulkInsert('UserGroups', [{
        userId: userId,
        groupId: groups[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserGroups', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Vaults', null, {});
    await queryInterface.bulkDelete('Timelines', null, {});
  }
};