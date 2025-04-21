import { users } from '@models';
import { init } from '../lib/testServer';
import { mockData } from './mockData';
import { DEFAULT_METADATA_OPTIONS } from './constants';

export function configDB(metadataOptions = DEFAULT_METADATA_OPTIONS) {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  const userMock = DBConnectionMock.define('users', mockData.MOCK_USER);
  userMock.findByPk = (query) => userMock.findById(query);
  userMock.count = () => 1;

  const vehicleMock = DBConnectionMock.define(
    'vehicles',
    mockData.MOCK_VEHICLE,
  );
  vehicleMock.findOne = () => Promise.resolve(mockData.MOCK_VEHICLE);
  vehicleMock.findAll = () => [mockData.MOCK_VEHICLE, mockData.MOCK_VEHICLE_2];

  const vehicleTypesMock = DBConnectionMock.define(
    'vehicleTypes',
    mockData.MOCK_VEHICLE_TYPE,
  );
  vehicleTypesMock.findOne = (query) => vehicleTypesMock.findById(query);
  vehicleTypesMock.findAll = () => [mockData.MOCK_VEHICLE_TYPE];

  const tripsMock = DBConnectionMock.define('trips', mockData.MOCK_TRIP);
  tripsMock.create = (mutation) =>
    Promise.resolve({
      ...mutation,
      id: '1',
    });
  tripsMock.update = (mutation) => Promise.resolve([1]);
  tripsMock.findOne = (query) => tripsMock.findById(query);
  tripsMock.findAll = () => [mockData.MOCK_TRIP, mockData.MOCK_TRIP_2];

  const tripLocationsMock = DBConnectionMock.define(
    'tripLocations',
    mockData.MOCK_TRIP_LOCATION,
  );
  tripLocationsMock.create = (mutation) =>
    Promise.resolve({ ...mutation, id: '1' });
  tripLocationsMock.findAll = () => [
    mockData.MOCK_TRIP_LOCATION,
    mockData.MOCK_TRIP_LOCATION_2,
  ];
  tripLocationsMock.findOne = (query) => tripLocationsMock.findById(query);

  const driverLocationsMock = DBConnectionMock.define(
    'driverLocations',
    mockData.MOCK_DRIVER_LOCATION,
  );
  driverLocationsMock.findOne = (query) => driverLocationsMock.findById(query);
  driverLocationsMock.findAll = () => [mockData.MOCK_DRIVER_LOCATION];

  const paymentsMock = DBConnectionMock.define(
    'payments',
    mockData.MOCK_PAYMENT,
  );
  paymentsMock.create = (mutation) => Promise.resolve({ ...mutation, id: 1 });
  paymentsMock.update = (mutation, options) => Promise.resolve([1]);
  paymentsMock.findByPk = (id) => Promise.resolve(mockData.MOCK_PAYMENT);
  paymentsMock.findAll = () => [mockData.MOCK_PAYMENT, mockData.MOCK_PAYMENT_2];
  paymentsMock.destroy = () => Promise.resolve(1);

  const pricingConfigsMock = DBConnectionMock.define(
    'pricingConfigs',
    mockData.MOCK_PRICING_CONFIG,
  );
  pricingConfigsMock.findOne = (query) => pricingConfigsMock.findById(query);
  pricingConfigsMock.findAll = () => [mockData.MOCK_PRICING_CONFIG];

  const ratingMock = DBConnectionMock.define('ratings', mockData.MOCK_RATING);

  ratingMock.create = (mutation) =>
    new Promise((resolve) => resolve({ ...mutation }));

  ratingMock.update = (mutation) =>
    new Promise((resolve) => resolve({ ...mutation }));

  ratingMock.findAll = () => [mockData.MOCK_RATING];

  ratingMock.destroy = (mutation) =>
    new Promise((resolve) => resolve({ ...mutation }));

  ratingMock.findOne = (query) => ratingMock.findById(query);

  const oauthClientsMock = DBConnectionMock.define(
    'oauthClients',
    mockData.MOCK_OAUTH_CLIENTS(metadataOptions),
  );
  oauthClientsMock.findOne = (query) => oauthClientsMock.findById(query);

  const oauthAccessTokensMock = DBConnectionMock.define(
    'oauth_access_tokens',
    mockData.MOCK_OAUTH_ACCESS_TOKENS,
  );
  oauthAccessTokensMock.create = (mutation) =>
    new Promise((resolve) => resolve({ ...mutation }));

  const oauthClientResourcesMock = DBConnectionMock.define(
    'oauth_client_resources',
    mockData.MOCK_OAUTH_CLIENT_RESOURCES[0],
  );
  oauthClientResourcesMock.findOne = (query) =>
    oauthClientResourcesMock.findById(query);

  oauthClientResourcesMock.findAll = (query) =>
    oauthClientResourcesMock.findById(query);

  const oauthClientScopesMock = DBConnectionMock.define(
    'oauth_client_scopes',
    mockData.MOCK_OAUTH_CLIENT_SCOPES,
  );

  oauthClientScopesMock.findOne = (query) =>
    oauthClientScopesMock.findById(query);

  oauthClientScopesMock.findAll = (query) =>
    oauthClientScopesMock.findById(query);
  return {
    users: userMock,
    vehicles: vehicleMock,
    vehicleTypes: vehicleTypesMock,
    trips: tripsMock,
    tripLocations: tripLocationsMock,
    driverLocations: driverLocationsMock,
    payments: paymentsMock,
    pricingConfigs: pricingConfigsMock,
    ratings: ratingMock,
    oauthClients: oauthClientsMock,
    oauthAccessTokens: oauthAccessTokensMock,
    oauthClientResources: oauthClientResourcesMock,
    oauthClientScopes: oauthClientScopesMock,
  };
}

export function bustDB() {
  users.sync({ force: true }); // this will clear all the entries in your table.
}

export async function mockDB(
  mockCallback = () => {},
  metadataOptions = DEFAULT_METADATA_OPTIONS,
) {
  jest.doMock('@models', () => {
    const sequelizeData = configDB(metadataOptions);
    if (mockCallback) {
      mockCallback({ models: sequelizeData });
    }
    return { models: sequelizeData };
  });
}

export const resetAndMockDB = async (
  mockDBCallback = () => {},
  metadataOptions = DEFAULT_METADATA_OPTIONS,
) => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  mockDB(mockDBCallback, metadataOptions);
  const server = await init();
  return server;
};
