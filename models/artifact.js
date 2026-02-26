'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artifact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Inside Artifact class in models/artifact.js
static associate(models) {
  this.belongsTo(models.Vault, { foreignKey: 'vaultId', as: 'vault' });
  this.belongsTo(models.Anomaly, { foreignKey: 'anomalyId', as: 'anomaly' }); // You might need to add anomalyId to migration if missing
  this.hasMany(models.AuditLog, { foreignKey: 'targetId', constraints: false });
}
  }
  Artifact.init({
    name: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    originEra: DataTypes.STRING,
    dangerLevel: DataTypes.INTEGER,
    status: DataTypes.STRING,
    vaultId: DataTypes.INTEGER,
    anomalyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Artifact',
  });
  return Artifact;
};