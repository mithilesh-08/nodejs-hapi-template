const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PricingConfigs.init(sequelize, DataTypes);
}

class PricingConfigs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    baseFare: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'base_fare'
    },
    perKmRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'per_km_rate'
    },
    perMinuteRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'per_minute_rate'
    },
    bookingFee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'booking_fee'
    },
    surchargeMultiplier: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'surcharge_multiplier'
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'effective_from'
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'effective_to'
    }
  }, {
    sequelize,
    tableName: 'pricing_configs',
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
    ]
  });
  }
}
