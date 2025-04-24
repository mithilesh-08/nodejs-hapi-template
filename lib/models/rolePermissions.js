import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class rolePermissions extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'rolePermissions',
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('uuid'),
          primaryKey: true,
        },
        roleId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'roles',
            key: 'id',
          },
          field: 'role_id',
        },
        permissionId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'permissions',
            key: 'id',
          },
          field: 'permission_id',
        },
      },
      {
        tableName: 'role_permissions',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'fk_role_permissions_role_id',
            using: 'BTREE',
            fields: [{ name: 'role_id' }],
          },
          {
            name: 'fk_role_permissions_permission_id',
            using: 'BTREE',
            fields: [{ name: 'permission_id' }],
          },
        ],
      },
    );
  }
}
