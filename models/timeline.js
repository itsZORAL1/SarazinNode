'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
  this.hasMany(models.Anomaly, { foreignKey: 'timelineId', as: 'anomalies' });
}
  }
  Timeline.init({
    name: DataTypes.STRING,
    stabilityIndex: DataTypes.INTEGER,
    isPruned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Timeline',
  });
  return Timeline;
};