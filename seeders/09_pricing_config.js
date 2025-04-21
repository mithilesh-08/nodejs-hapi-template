const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    const effectiveFrom = new Date();
    const effectiveTo = new Date();
    effectiveTo.setMonth(effectiveFrom.getMonth() + 1);
    return queryInterface.bulkInsert('pricing_configs', [
      {
        id: uuidv4(),
        base_fare: 10,
        per_km_rate: 1,
        per_minute_rate: 0.5,
        booking_fee: 10,
        surcharge_multiplier: 1.5,
        effective_from: effectiveFrom,
        effective_to: effectiveTo,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) =>
    queryInterface.bulkDelete('pricing_configs', null, {}),
};
