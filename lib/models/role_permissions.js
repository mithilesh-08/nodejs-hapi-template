const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return RolePermissions.init(sequelize, DataTypes);
}

class RolePermissions extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    roleId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      },
      field: 'role_id'
    },
    permissionId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      },
      field: 'permission_id'
    }
  }, {
    sequelize,
    tableName: 'role_permissions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_role_permissions_role_id",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
      {
        name: "fk_role_permissions_permission_id",
        using: "BTREE",
        fields: [
          { name: "permission_id" },
        ]
      },
    ]
  });
  }
}
