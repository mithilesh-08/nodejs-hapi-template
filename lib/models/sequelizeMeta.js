import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class sequelizeMeta extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'sequelizeMeta',
      {
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        tableName: 'SequelizeMeta',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'name' }],
          },
          {
            name: 'name',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'name' }],
          },
        ],
      },
    );
  }
}
