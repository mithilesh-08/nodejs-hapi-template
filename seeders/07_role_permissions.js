
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // First, get all roles and permissions
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const permissions = await queryInterface.sequelize.query(
      'SELECT id, name FROM permissions;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create role-permission mappings
    const rolePermissions = [];

    // Map SUPER_ADMIN role to all permissions
    const superAdminRole = roles.find(role => role.name === 'SUPER_ADMIN');
    if (superAdminRole) {
      permissions.forEach(permission => {
        rolePermissions.push({
          id: uuidv4(),
          role_id: superAdminRole.id,
          permission_id: permission.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Map ADMIN role to specific permissions
    const adminRole = roles.find(role => role.name === 'ADMIN');
    if (adminRole) {
      
      permissions.forEach(permission => {
        rolePermissions.push({
          id: uuidv4(),
          role_id: adminRole.id,
          permission_id: permission.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Map RIDER role to specific permissions
    const riderRole = roles.find(role => role.name === 'RIDER');
    if (riderRole) {
      const riderPermissions = permissions.filter(p => 
        p.name.includes('BOOK_A_RIDE') || p.name.includes('VIEW_DRIVER_DETAILS') || p.name.includes('CANCEL_A_RIDE')
      );
      riderPermissions.forEach(permission => {
        rolePermissions.push({
          id: uuidv4(),
          role_id: riderRole.id,
          permission_id: permission.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Map DRIVER role to specific permissions
    const driverRole = roles.find(role => role.name === 'DRIVER');
    if (driverRole) {
      const driverPermissions = permissions.filter(p => 
        p.name.includes('VIEW_RIDER_DETAILS') || p.name.includes('CANCEL_A_RIDE')
      );
      driverPermissions.forEach(permission => {
        rolePermissions.push({
          id: uuidv4(),
          role_id: driverRole.id,
          permission_id: permission.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Insert all role-permission mappings
    return queryInterface.bulkInsert('role_permissions', rolePermissions, {});
  },

  down: (queryInterface) => 
     queryInterface.bulkDelete('role_permissions', null, {})
  
};
