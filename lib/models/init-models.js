const DataTypes = require("sequelize").DataTypes;
const _SequelizeMeta = require("./SequelizeMeta");
const _DriverLocations = require("./driver_locations");
const _OauthAccessTokens = require("./oauth_access_tokens");
const _OauthClientResources = require("./oauth_client_resources");
const _OauthClientScopes = require("./oauth_client_scopes");
const _OauthClients = require("./oauth_clients");
const _Payments = require("./payments");
const _Permissions = require("./permissions");
const _PricingConfigs = require("./pricing_configs");
const _Ratings = require("./ratings");
const _RolePermissions = require("./role_permissions");
const _Roles = require("./roles");
const _TripLocations = require("./trip_locations");
const _Trips = require("./trips");
const _Users = require("./users");
const _VehicleTypes = require("./vehicle_types");
const _Vehicles = require("./vehicles");

function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  const DriverLocations = _DriverLocations(sequelize, DataTypes);
  const OauthAccessTokens = _OauthAccessTokens(sequelize, DataTypes);
  const OauthClientResources = _OauthClientResources(sequelize, DataTypes);
  const OauthClientScopes = _OauthClientScopes(sequelize, DataTypes);
  const OauthClients = _OauthClients(sequelize, DataTypes);
  const Payments = _Payments(sequelize, DataTypes);
  const Permissions = _Permissions(sequelize, DataTypes);
  const PricingConfigs = _PricingConfigs(sequelize, DataTypes);
  const Ratings = _Ratings(sequelize, DataTypes);
  const RolePermissions = _RolePermissions(sequelize, DataTypes);
  const Roles = _Roles(sequelize, DataTypes);
  const TripLocations = _TripLocations(sequelize, DataTypes);
  const Trips = _Trips(sequelize, DataTypes);
  const Users = _Users(sequelize, DataTypes);
  const VehicleTypes = _VehicleTypes(sequelize, DataTypes);
  const Vehicles = _Vehicles(sequelize, DataTypes);

  OauthAccessTokens.belongsTo(OauthClients, { as: "oauthClient", foreignKey: "oauthClientId"});
  OauthClients.hasMany(OauthAccessTokens, { as: "oauthAccessTokens", foreignKey: "oauthClientId"});
  OauthClientResources.belongsTo(OauthClients, { as: "oauthClient", foreignKey: "oauthClientId"});
  OauthClients.hasMany(OauthClientResources, { as: "oauthClientResources", foreignKey: "oauthClientId"});
  OauthClientScopes.belongsTo(OauthClients, { as: "oauthClient", foreignKey: "oauthClientId"});
  OauthClients.hasOne(OauthClientScopes, { as: "oauthClientScope", foreignKey: "oauthClientId"});
  RolePermissions.belongsTo(Permissions, { as: "permission", foreignKey: "permissionId"});
  Permissions.hasMany(RolePermissions, { as: "rolePermissions", foreignKey: "permissionId"});
  RolePermissions.belongsTo(Roles, { as: "role", foreignKey: "roleId"});
  Roles.hasMany(RolePermissions, { as: "rolePermissions", foreignKey: "roleId"});
  Users.belongsTo(Roles, { as: "role", foreignKey: "roleId"});
  Roles.hasMany(Users, { as: "users", foreignKey: "roleId"});
  Payments.belongsTo(Trips, { as: "trip", foreignKey: "tripId"});
  Trips.hasMany(Payments, { as: "payments", foreignKey: "tripId"});
  TripLocations.belongsTo(Trips, { as: "trip", foreignKey: "tripId"});
  Trips.hasMany(TripLocations, { as: "tripLocations", foreignKey: "tripId"});
  DriverLocations.belongsTo(Users, { as: "driver", foreignKey: "driverId"});
  Users.hasMany(DriverLocations, { as: "driverLocations", foreignKey: "driverId"});
  Payments.belongsTo(Users, { as: "driver", foreignKey: "driverId"});
  Users.hasMany(Payments, { as: "payments", foreignKey: "driverId"});
  Payments.belongsTo(Users, { as: "rider", foreignKey: "riderId"});
  Users.hasMany(Payments, { as: "riderPayments", foreignKey: "riderId"});
  Ratings.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Ratings, { as: "ratings", foreignKey: "userId"});
  Trips.belongsTo(Users, { as: "driver", foreignKey: "driverId"});
  Users.hasMany(Trips, { as: "trips", foreignKey: "driverId"});
  Trips.belongsTo(Users, { as: "rider", foreignKey: "riderId"});
  Users.hasMany(Trips, { as: "riderTrips", foreignKey: "riderId"});
  Vehicles.belongsTo(Users, { as: "driver", foreignKey: "driverId"});
  Users.hasMany(Vehicles, { as: "vehicles", foreignKey: "driverId"});
  Vehicles.belongsTo(VehicleTypes, { as: "vehicleType", foreignKey: "vehicleTypeId"});
  VehicleTypes.hasMany(Vehicles, { as: "vehicles", foreignKey: "vehicleTypeId"});
  Payments.belongsTo(Vehicles, { as: "vehicle", foreignKey: "vehicleId"});
  Vehicles.hasMany(Payments, { as: "payments", foreignKey: "vehicleId"});
  Trips.belongsTo(Vehicles, { as: "vehicle", foreignKey: "vehicleId"});
  Vehicles.hasMany(Trips, { as: "trips", foreignKey: "vehicleId"});

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
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
