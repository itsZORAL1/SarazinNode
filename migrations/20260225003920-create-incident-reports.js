'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IncidentReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vaultId: {
        type: Sequelize.INTEGER,
        references: { model: 'Vaults', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      severity: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 'OPEN' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IncidentReports');
  }
};