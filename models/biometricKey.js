// models/biometricKey.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BiometricKey extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  BiometricKey.init({
    userId: DataTypes.INTEGER,
    keyHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BiometricKey', // THIS MUST MATCH
  });
  return BiometricKey;
};