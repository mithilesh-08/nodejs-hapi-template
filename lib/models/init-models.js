import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _sequelizeMeta from './sequelizeMeta.js';
import _driverLocations from './driverLocations.js';
import _oauthAccessTokens from './oauthAccessTokens.js';
import _oauthClientResources from './oauthClientResources.js';
import _oauthClientScopes from './oauthClientScopes.js';
import _oauthClients from './oauthClients.js';
import _payments from './payments.js';
import _permissions from './permissions.js';
import _pricingConfigs from './pricingConfigs.js';
import _ratings from './ratings.js';
import _rolePermissions from './rolePermissions.js';
import _roles from './roles.js';
import _tripLocations from './tripLocations.js';
import _trips from './trips.js';
import _users from './users.js';
import _vehicleTypes from './vehicleTypes.js';
import _vehicles from './vehicles.js';

export default function initModels(sequelize) {
  const sequelizeMeta = _sequelizeMeta.init(sequelize, DataTypes);
  const driverLocations = _driverLocations.init(sequelize, DataTypes);
  const oauthAccessTokens = _oauthAccessTokens.init(sequelize, DataTypes);
  const oauthClientResources = _oauthClientResources.init(sequelize, DataTypes);
  const oauthClientScopes = _oauthClientScopes.init(sequelize, DataTypes);
  const oauthClients = _oauthClients.init(sequelize, DataTypes);
  const payments = _payments.init(sequelize, DataTypes);
  const permissions = _permissions.init(sequelize, DataTypes);
  const pricingConfigs = _pricingConfigs.init(sequelize, DataTypes);
  const ratings = _ratings.init(sequelize, DataTypes);
  const rolePermissions = _rolePermissions.init(sequelize, DataTypes);
  const roles = _roles.init(sequelize, DataTypes);
  const tripLocations = _tripLocations.init(sequelize, DataTypes);
  const trips = _trips.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);
  const vehicleTypes = _vehicleTypes.init(sequelize, DataTypes);
  const vehicles = _vehicles.init(sequelize, DataTypes);

  oauthAccessTokens.belongsTo(oauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  oauthClients.hasMany(oauthAccessTokens, {
    as: 'oauthAccessTokens',
    foreignKey: 'oauthClientId',
  });
  oauthClientResources.belongsTo(oauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  oauthClients.hasMany(oauthClientResources, {
    as: 'oauthClientResources',
    foreignKey: 'oauthClientId',
  });
  oauthClientScopes.belongsTo(oauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  oauthClients.hasOne(oauthClientScopes, {
    as: 'oauthClientScope',
    foreignKey: 'oauthClientId',
  });
  users.belongsTo(oauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  oauthClients.hasMany(users, { as: 'users', foreignKey: 'oauthClientId' });
  rolePermissions.belongsTo(permissions, {
    as: 'permission',
    foreignKey: 'permissionId',
  });
  permissions.hasMany(rolePermissions, {
    as: 'rolePermissions',
    foreignKey: 'permissionId',
  });
  rolePermissions.belongsTo(roles, { as: 'role', foreignKey: 'roleId' });
  roles.hasMany(rolePermissions, {
    as: 'rolePermissions',
    foreignKey: 'roleId',
  });
  users.belongsTo(roles, { as: 'role', foreignKey: 'roleId' });
  roles.hasMany(users, { as: 'users', foreignKey: 'roleId' });
  payments.belongsTo(trips, { as: 'trip', foreignKey: 'tripId' });
  trips.hasMany(payments, { as: 'payments', foreignKey: 'tripId' });
  tripLocations.belongsTo(trips, { as: 'trip', foreignKey: 'tripId' });
  trips.hasMany(tripLocations, { as: 'tripLocations', foreignKey: 'tripId' });
  driverLocations.belongsTo(users, { as: 'driver', foreignKey: 'driverId' });
  users.hasMany(driverLocations, {
    as: 'driverLocations',
    foreignKey: 'driverId',
  });
  payments.belongsTo(users, { as: 'driver', foreignKey: 'driverId' });
  users.hasMany(payments, { as: 'payments', foreignKey: 'driverId' });
  payments.belongsTo(users, { as: 'rider', foreignKey: 'riderId' });
  users.hasMany(payments, { as: 'riderPayments', foreignKey: 'riderId' });
  ratings.belongsTo(users, { as: 'user', foreignKey: 'userId' });
  users.hasMany(ratings, { as: 'ratings', foreignKey: 'userId' });
  trips.belongsTo(users, { as: 'driver', foreignKey: 'driverId' });
  users.hasMany(trips, { as: 'trips', foreignKey: 'driverId' });
  trips.belongsTo(users, { as: 'rider', foreignKey: 'riderId' });
  users.hasMany(trips, { as: 'riderTrips', foreignKey: 'riderId' });
  vehicles.belongsTo(users, { as: 'driver', foreignKey: 'driverId' });
  users.hasMany(vehicles, { as: 'vehicles', foreignKey: 'driverId' });
  vehicles.belongsTo(vehicleTypes, {
    as: 'vehicleType',
    foreignKey: 'vehicleTypeId',
  });
  vehicleTypes.hasMany(vehicles, {
    as: 'vehicles',
    foreignKey: 'vehicleTypeId',
  });
  payments.belongsTo(vehicles, { as: 'vehicle', foreignKey: 'vehicleId' });
  vehicles.hasMany(payments, { as: 'payments', foreignKey: 'vehicleId' });
  trips.belongsTo(vehicles, { as: 'vehicle', foreignKey: 'vehicleId' });
  vehicles.hasMany(trips, { as: 'trips', foreignKey: 'vehicleId' });

  return {
    sequelizeMeta,
    driverLocations,
    oauthAccessTokens,
    oauthClientResources,
    oauthClientScopes,
    oauthClients,
    payments,
    permissions,
    pricingConfigs,
    ratings,
    rolePermissions,
    roles,
    tripLocations,
    trips,
    users,
    vehicleTypes,
    vehicles,
  };
}
