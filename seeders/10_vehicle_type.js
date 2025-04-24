const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    const arr = [
      {
        id: uuidv4(),
        name: 'SEDAN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'SUV',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'HATCHBACK',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'TRUCK',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    return queryInterface.bulkInsert('vehicle_types', arr, {});
  },
  down: (queryInterface) =>
    queryInterface.bulkDelete('vehicle_types', null, {}),
};
