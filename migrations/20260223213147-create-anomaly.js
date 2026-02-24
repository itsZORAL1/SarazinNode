'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Anomalies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      severity: {
        type: Sequelize.INTEGER
      },
      timelineId: {
  type: Sequelize.INTEGER,
  references: { model: 'Timelines', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL' // If a timeline is pruned, the anomaly remains as an "orphan"
},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Anomalies');
  }
};