'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // One-to-Many: User has many Sessions
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

Session.init({
  token: {
    type: DataTypes.TEXT, 
    allowNull: false,
    unique: true
  },
  userId: DataTypes.INTEGER,
  expiresAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Session',
});
  return Session;
};