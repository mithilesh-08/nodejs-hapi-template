
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    const arr = [
      {
        id: uuidv4(),
        name: 'BOOK_A_RIDE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'CANCEL_A_RIDE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'VIEW_RIDER_DETAILS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'VIEW_DRIVER_DETAILS',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    return queryInterface.bulkInsert('permissions', arr, {});
  },
  down: (queryInterface) => queryInterface.bulkDelete('permissions', null, {}),
};
