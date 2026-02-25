'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anomaly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     this.belongsTo(models.Timeline, { foreignKey: 'timelineId', as: 'timeline' });
     this.hasMany(models.Artifact, { foreignKey: 'anomalyId', as: 'artifacts' });
    }
  }
// models/anomaly.js
Anomaly.init({
  type: DataTypes.STRING,
  location: DataTypes.STRING,
  severity: DataTypes.INTEGER,
  status: DataTypes.STRING, // ADD THIS
  timelineId: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'Anomaly',
});
  return Anomaly;
};