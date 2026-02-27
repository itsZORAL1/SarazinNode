'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }


Session.init({
  token: { type: DataTypes.TEXT, allowNull: false },
  userId: DataTypes.INTEGER,
  expiresAt: DataTypes.DATE,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.STRING  
}, {
  sequelize,
  modelName: 'Session',
});
  return Session;
};