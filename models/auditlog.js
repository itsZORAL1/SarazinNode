'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
  // Every log entry MUST be tied to a user for accountability
  this.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
}
  }
AuditLog.init({
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    targetId: DataTypes.STRING,
    details: DataTypes.TEXT, // <--- ADD THIS LINE
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AuditLog',
  });
  return AuditLog;
};