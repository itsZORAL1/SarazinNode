'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static associate(models) {
      this.belongsToMany(models.User, { 
      through: 'UserGroups', 
      foreignKey: 'groupId', 
      otherKey: 'userId',    
      as: 'users' 
       });
    }
  }
  Group.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};