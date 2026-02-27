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
  
  this.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
}
  }
AuditLog.init({
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    targetId: DataTypes.STRING,
    details: DataTypes.TEXT, 
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AuditLog',
  });
  return AuditLog;
};