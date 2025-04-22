import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ratings extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'ratings',
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('uuid'),
          primaryKey: true,
        },
        userId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          field: 'user_id',
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: 'ratings',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_ratings_user_id',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'idx_ratings_created_at',
            using: 'BTREE',
            fields: [{ name: 'created_at' }],
          },
        ],
      },
    );
  }
}
