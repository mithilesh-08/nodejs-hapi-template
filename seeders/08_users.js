
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async(queryInterface) => {
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const arr = [
      {
        id: uuidv4(),
        name: 'Mithilesh',
        role_id: roles.find(role => role.name === 'SUPER_ADMIN').id,
        password: bcrypt.hashSync('password', 10),
        phone_number: '7350977851',
        email: 'mithilesh@wednesday.is',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Raj',
        role_id: roles.find(role => role.name === 'ADMIN').id,
        password: bcrypt.hashSync('password', 10),
        phone_number: '7350977852',
        email: 'raj@wednesday.is',
        created_at: new Date(),
        updated_at: new Date(),
      },{
        id: uuidv4(),
        name:'Rajesh',
        role_id: roles.find(role => role.name === 'DRIVER').id,
        password: bcrypt.hashSync('password', 10),
        phone_number: '7350977853',
        email: 'rajesh@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name:'Ramesh',
        role_id: roles.find(role => role.name === 'RIDER').id,
        password: bcrypt.hashSync('password', 10),
        phone_number: '7350977854',
        email: 'ramesh@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    return queryInterface.bulkInsert('users', arr, {});
  },
  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
