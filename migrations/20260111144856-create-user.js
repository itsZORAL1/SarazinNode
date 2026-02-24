'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: { type: Sequelize.STRING },
      lastname: { type: Sequelize.STRING },
      email: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true // Pentest Fix: Prevent duplicate emails
      },
      password: { 
        type: Sequelize.STRING, 
        allowNull: false // CRITICAL: Every agent needs a secure hash
      },
      clearanceLevel: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 // 1: Trainee, 5: Director
      },
      accountStatus: { 
        type: Sequelize.STRING, 
        defaultValue: 'Active' 
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};