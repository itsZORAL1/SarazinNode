'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
 
  this.belongsTo(models.User, { foreignKey: 'leadAgentId', as: 'agent' });
  
  this.belongsTo(models.Anomaly, { foreignKey: 'anomalyId', as: 'anomaly' });
}
  }
  Mission.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    destinationEra: DataTypes.STRING,
    leadAgentId: DataTypes.INTEGER,
    anomalyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mission',
  });
  return Mission;
};