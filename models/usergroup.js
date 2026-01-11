'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {

    static associate(models) {
     
    }
  }
  UserGroup.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserGroup',
  });
  return UserGroup;
};