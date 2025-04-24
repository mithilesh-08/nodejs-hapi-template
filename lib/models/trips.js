import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class trips extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'trips',
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('uuid'),
          primaryKey: true,
        },
        driverId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          field: 'driver_id',
        },
        riderId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          field: 'rider_id',
        },
        vehicleId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'vehicles',
            key: 'id',
          },
          field: 'vehicle_id',
        },
        pickupLocation: {
          type: 'POINT',
          allowNull: false,
          field: 'pickup_location',
        },
        dropoffLocation: {
          type: 'POINT',
          allowNull: false,
          field: 'dropoff_location',
        },
        distance: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_time',
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'end_time',
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fare: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        tableName: 'trips',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_trips_status',
            using: 'BTREE',
            fields: [{ name: 'status' }],
          },
          {
            name: 'idx_trips_start_time',
            using: 'BTREE',
            fields: [{ name: 'start_time' }],
          },
          {
            name: 'idx_trips_end_time',
            using: 'BTREE',
            fields: [{ name: 'end_time' }],
          },
          {
            name: 'idx_trips_pickup_location',
            type: 'SPATIAL',
            fields: [{ name: 'pickup_location', length: 32 }],
          },
          {
            name: 'idx_trips_dropoff_location',
            type: 'SPATIAL',
            fields: [{ name: 'dropoff_location', length: 32 }],
          },
          {
            name: 'fk_trips_driver_id',
            using: 'BTREE',
            fields: [{ name: 'driver_id' }],
          },
          {
            name: 'fk_trips_rider_id',
            using: 'BTREE',
            fields: [{ name: 'rider_id' }],
          },
          {
            name: 'fk_trips_vehicle_id',
            using: 'BTREE',
            fields: [{ name: 'vehicle_id' }],
          },
        ],
      },
    );
  }
}
