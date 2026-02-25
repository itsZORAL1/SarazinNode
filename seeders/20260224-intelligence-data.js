'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Get the existing Timeline or create if missing
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

    // 2. Create Anomalies
    // Inside your seeder's up function
await queryInterface.bulkInsert('Anomalies', [
  {
    type: 'The Victorian Laptop', // Was 'name'
    location: '1888 London',      // Was 'description'
    severity: 4,                  // Was 'dangerLevel'
    status: 'OPEN',
    timelineId: timelineId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

    // 3. Log this in Audit Logs (The Professional Touch)
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