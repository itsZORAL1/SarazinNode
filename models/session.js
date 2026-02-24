'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // One-to-Many: User has many Sessions
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

// models/session.js
Session.init({
  token: { type: DataTypes.TEXT, allowNull: false },
  userId: DataTypes.INTEGER,
  expiresAt: DataTypes.DATE,
  ipAddress: DataTypes.STRING, // Pentest requirement: Track source
  userAgent: DataTypes.STRING  // Pentest requirement: Detect hijacking
}, {
  sequelize,
  modelName: 'Session',
});
  return Session;
};