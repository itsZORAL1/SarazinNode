'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vault extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
// Inside Vault class in models/vault.js
static associate(models) {
  this.hasMany(models.Artifact, { foreignKey: 'vaultId', as: 'artifacts' });
}
  }
  Vault.init({
    locationName: DataTypes.STRING,
    securityProtocol: DataTypes.STRING,
    maxCapacity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vault',
  });
  return Vault;
};