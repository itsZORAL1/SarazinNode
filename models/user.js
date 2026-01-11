'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   
    static associate(models) {
    this.hasMany(models.Device, { foreignKey: 'userId', as: 'devices' });
    this.belongsToMany(models.Group, { 
     through: 'UserGroups', 
     foreignKey: 'userId', 
     otherKey: 'groupId',   
     as: 'groups' 
       });
    }
  }
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};