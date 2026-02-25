'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncidentReport extends Model {
    static associate(models) {
      this.belongsTo(models.Vault, { foreignKey: 'vaultId' });
    }
  }
  IncidentReport.init({
    vaultId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    severity: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'OPEN' }
  }, {
    sequelize,
    modelName: 'IncidentReport',
  });
  return IncidentReport;
};