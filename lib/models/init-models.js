import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _SequelizeMeta from './sequelizeMeta.js';
import _DriverLocations from './driverLocations.js';
import _OauthAccessTokens from './oauthAccessTokens.js';
import _OauthClientResources from './oauthClientResources.js';
import _OauthClientScopes from './oauthClientScopes.js';
import _OauthClients from './oauthClients.js';
import _Payments from './payments.js';
import _Permissions from './permissions.js';
import _PricingConfigs from './pricingConfigs.js';
import _Ratings from './ratings.js';
import _RolePermissions from './rolePermissions.js';
import _Roles from './roles.js';
import _TripLocations from './tripLocations.js';
import _Trips from './trips.js';
import _Users from './users.js';
import _VehicleTypes from './vehicleTypes.js';
import _Vehicles from './vehicles.js';

export default function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta.init(sequelize, DataTypes);
  const DriverLocations = _DriverLocations.init(sequelize, DataTypes);
  const OauthAccessTokens = _OauthAccessTokens.init(sequelize, DataTypes);
  const OauthClientResources = _OauthClientResources.init(sequelize, DataTypes);
  const OauthClientScopes = _OauthClientScopes.init(sequelize, DataTypes);
  const OauthClients = _OauthClients.init(sequelize, DataTypes);
  const Payments = _Payments.init(sequelize, DataTypes);
  const Permissions = _Permissions.init(sequelize, DataTypes);
  const PricingConfigs = _PricingConfigs.init(sequelize, DataTypes);
  const Ratings = _Ratings.init(sequelize, DataTypes);
  const RolePermissions = _RolePermissions.init(sequelize, DataTypes);
  const Roles = _Roles.init(sequelize, DataTypes);
  const TripLocations = _TripLocations.init(sequelize, DataTypes);
  const Trips = _Trips.init(sequelize, DataTypes);
  const Users = _Users.init(sequelize, DataTypes);
  const VehicleTypes = _VehicleTypes.init(sequelize, DataTypes);
  const Vehicles = _Vehicles.init(sequelize, DataTypes);

  OauthAccessTokens.belongsTo(OauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  OauthClients.hasMany(OauthAccessTokens, {
    as: 'oauthAccessTokens',
    foreignKey: 'oauthClientId',
  });
  OauthClientResources.belongsTo(OauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  OauthClients.hasMany(OauthClientResources, {
    as: 'oauthClientResources',
    foreignKey: 'oauthClientId',
  });
  OauthClientScopes.belongsTo(OauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  OauthClients.hasOne(OauthClientScopes, {
    as: 'oauthClientScope',
    foreignKey: 'oauthClientId',
  });
  Users.belongsTo(OauthClients, {
    as: 'oauthClient',
    foreignKey: 'oauthClientId',
  });
  OauthClients.hasMany(Users, { as: 'users', foreignKey: 'oauthClientId' });
  RolePermissions.belongsTo(Permissions, {
    as: 'permission',
    foreignKey: 'permissionId',
  });
  Permissions.hasMany(RolePermissions, {
    as: 'rolePermissions',
    foreignKey: 'permissionId',
  });
  RolePermissions.belongsTo(Roles, { as: 'role', foreignKey: 'roleId' });
  Roles.hasMany(RolePermissions, {
    as: 'rolePermissions',
    foreignKey: 'roleId',
  });
  Users.belongsTo(Roles, { as: 'role', foreignKey: 'roleId' });
  Roles.hasMany(Users, { as: 'users', foreignKey: 'roleId' });
  Payments.belongsTo(Trips, { as: 'trip', foreignKey: 'tripId' });
  Trips.hasMany(Payments, { as: 'payments', foreignKey: 'tripId' });
  TripLocations.belongsTo(Trips, { as: 'trip', foreignKey: 'tripId' });
  Trips.hasMany(TripLocations, { as: 'tripLocations', foreignKey: 'tripId' });
  DriverLocations.belongsTo(Users, { as: 'driver', foreignKey: 'driverId' });
  Users.hasMany(DriverLocations, {
    as: 'driverLocations',
    foreignKey: 'driverId',
  });
  Payments.belongsTo(Users, { as: 'driver', foreignKey: 'driverId' });
  Users.hasMany(Payments, { as: 'payments', foreignKey: 'driverId' });
  Payments.belongsTo(Users, { as: 'rider', foreignKey: 'riderId' });
  Users.hasMany(Payments, { as: 'riderPayments', foreignKey: 'riderId' });
  Ratings.belongsTo(Users, { as: 'user', foreignKey: 'userId' });
  Users.hasMany(Ratings, { as: 'ratings', foreignKey: 'userId' });
  Trips.belongsTo(Users, { as: 'driver', foreignKey: 'driverId' });
  Users.hasMany(Trips, { as: 'trips', foreignKey: 'driverId' });
  Trips.belongsTo(Users, { as: 'rider', foreignKey: 'riderId' });
  Users.hasMany(Trips, { as: 'riderTrips', foreignKey: 'riderId' });
  Vehicles.belongsTo(Users, { as: 'driver', foreignKey: 'driverId' });
  Users.hasMany(Vehicles, { as: 'vehicles', foreignKey: 'driverId' });
  Vehicles.belongsTo(VehicleTypes, {
    as: 'vehicleType',
    foreignKey: 'vehicleTypeId',
  });
  VehicleTypes.hasMany(Vehicles, {
    as: 'vehicles',
    foreignKey: 'vehicleTypeId',
  });
  Payments.belongsTo(Vehicles, { as: 'vehicle', foreignKey: 'vehicleId' });
  Vehicles.hasMany(Payments, { as: 'payments', foreignKey: 'vehicleId' });
  Trips.belongsTo(Vehicles, { as: 'vehicle', foreignKey: 'vehicleId' });
  Vehicles.hasMany(Trips, { as: 'trips', foreignKey: 'vehicleId' });

  return {
    SequelizeMeta,
    DriverLocations,
    OauthAccessTokens,
    OauthClientResources,
    OauthClientScopes,
    OauthClients,
    Payments,
    Permissions,
    PricingConfigs,
    Ratings,
    RolePermissions,
    Roles,
    TripLocations,
    Trips,
    Users,
    VehicleTypes,
    Vehicles,
  };
}
