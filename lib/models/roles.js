import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class roles extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'roles',
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('uuid'),
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: 'idx_roles_name',
        },
      },
      {
        tableName: 'roles',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_roles_name',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'name' }],
          },
        ],
      },
    );
  }
}
