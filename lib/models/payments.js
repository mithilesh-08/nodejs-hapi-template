import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class payments extends Model {
  static init(sequelize, DataTypes) {
    return sequelize.define(
      'payments',
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
        tripId: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'trips',
            key: 'id',
          },
          field: 'trip_id',
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'payment_method',
        },
        status: {
          type: DataTypes.ENUM('pending', 'completed', 'failed'),
          allowNull: false,
        },
        transactionId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: 'transaction_id',
          field: 'transaction_id',
        },
        paidAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'paid_at',
        },
      },
      {
        tableName: 'payments',
        timestamps: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'transaction_id',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'transaction_id' }],
          },
          {
            name: 'idx_payments_status',
            using: 'BTREE',
            fields: [{ name: 'status' }],
          },
          {
            name: 'idx_payments_paid_at',
            using: 'BTREE',
            fields: [{ name: 'paid_at' }],
          },
          {
            name: 'idx_payments_status_paid_at',
            using: 'BTREE',
            fields: [{ name: 'status' }, { name: 'paid_at' }],
          },
          {
            name: 'fk_payments_driver_id',
            using: 'BTREE',
            fields: [{ name: 'driver_id' }],
          },
          {
            name: 'fk_payments_rider_id',
            using: 'BTREE',
            fields: [{ name: 'rider_id' }],
          },
          {
            name: 'fk_payments_vehicle_id',
            using: 'BTREE',
            fields: [{ name: 'vehicle_id' }],
          },
          {
            name: 'fk_payments_trip_id',
            using: 'BTREE',
            fields: [{ name: 'trip_id' }],
          },
        ],
      },
    );
  }
}
