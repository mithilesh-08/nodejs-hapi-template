import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class tripLocations extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'tripLocations',
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('uuid'),
          primaryKey: true,
        },
        tripId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'trips',
            key: 'id',
          },
          field: 'trip_id',
        },
        location: {
          type: 'POINT',
          allowNull: false,
        },
      },
      {
        tableName: 'trip_locations',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_trip_locations_location',
            type: 'SPATIAL',
            fields: [{ name: 'location', length: 32 }],
          },
          {
            name: 'fk_trip_locations_trip_id',
            using: 'BTREE',
            fields: [{ name: 'trip_id' }],
          },
        ],
      },
    );
  }
}
