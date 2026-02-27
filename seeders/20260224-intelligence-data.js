'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let timelineId;
    const [existingTimeline] = await queryInterface.sequelize.query(
      `SELECT id FROM "Timelines" WHERE name = 'Prime Timeline (Mainline)' LIMIT 1;`
    );

    if (existingTimeline[0]) {
      timelineId = existingTimeline[0].id;
    } else {
      const timelines = await queryInterface.bulkInsert('Timelines', [{
        name: 'Prime Timeline (Mainline)',
        eraName: 'Modern Era',
        description: 'The primary stable branch.',
        createdAt: new Date(), updatedAt: new Date()
      }], { returning: true });
      timelineId = timelines[0].id;
    }

 
await queryInterface.bulkInsert('Anomalies', [
  {
    type: 'The Victorian Laptop', 
    location: '1888 London',      
    severity: 4,                
    status: 'OPEN',
    timelineId: timelineId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

   
    const [admin] = await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE email = 'admin@chronos.agency' LIMIT 1;`);
    if (admin[0]) {
      await queryInterface.bulkInsert('AuditLogs', [{
        userId: admin[0].id,
        action: 'SYSTEM_GENESIS',
        details: 'Initial intelligence data seeded into the archive.',
        ipAddress: '127.0.0.1',
        createdAt: new Date(), updatedAt: new Date()
      }]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Anomalies', null, {});
  }
};