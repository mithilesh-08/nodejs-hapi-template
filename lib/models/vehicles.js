const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Vehicles.init(sequelize, DataTypes);
}

class Vehicles extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    vehicleTypeId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'vehicle_types',
        key: 'id'
      },
      field: 'vehicle_type_id'
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
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "idx_vehicles_license_plate",
      field: 'license_plate'
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vehicles',
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
        name: "idx_vehicles_license_plate",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "license_plate" },
        ]
      },
      {
        name: "fk_vehicles_vehicle_type_id",
        using: "BTREE",
        fields: [
          { name: "vehicle_type_id" },
        ]
      },
      {
        name: "fk_vehicles_driver_id",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
    ]
  });
  }
}
