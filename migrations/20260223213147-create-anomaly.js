// migrations/20260223213147-create-anomaly.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Anomalies', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      type: { type: Sequelize.STRING },
      location: { type: Sequelize.STRING },
      severity: { type: Sequelize.INTEGER },
      status: { type: Sequelize.STRING, defaultValue: 'OPEN' }, // ADD THIS
      timelineId: {
        type: Sequelize.INTEGER,
        references: { model: 'Timelines', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Anomalies');
  }
};