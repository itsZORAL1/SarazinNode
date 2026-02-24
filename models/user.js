'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   
// Inside User class in models/user.js
static associate(models) {
  this.hasMany(models.Mission, { foreignKey: 'leadAgentId', as: 'missions' });
  this.hasMany(models.AuditLog, { foreignKey: 'userId', as: 'logs' });
  this.belongsToMany(models.Group, { through: 'UserGroups', foreignKey: 'userId', as: 'groups' });
  this.hasMany(models.Session, { foreignKey: 'userId', as: 'sessions' });
}
  }
// models/user.js
User.init({
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false // Must be hashed later!
  },
  clearanceLevel: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 // 1: Guest, 5: O5-Council
  },
  accountStatus: { 
    type: DataTypes.STRING, 
    defaultValue: 'Active' // Active, Suspended, MIA
  }
}, {
  sequelize,
  modelName: 'User',
});
  return User;
};