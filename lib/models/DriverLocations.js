import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class DriverLocations extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('DriverLocations', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    driverId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'driver_id'
    },
    location: {
      type: "POINT",
      allowNull: false
    }
  }, {
    tableName: 'driver_locations',
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
        name: "idx_driver_locations_driver_id",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
      {
        name: "idx_driver_locations_location",
        type: "SPATIAL",
        fields: [
          { name: "location", length: 32 },
        ]
      },
    ]
  });
  }
}
