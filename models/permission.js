'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // Many-to-Many with Group
      this.belongsToMany(models.Group, { 
        through: 'GroupPermissions', 
        foreignKey: 'permissionId', 
        as: 'groups' 
      });
    }
  }
  Permission.init({
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // e.g., 'user:delete'
    }
  }, { sequelize, modelName: 'Permission' });
  return Permission;
};