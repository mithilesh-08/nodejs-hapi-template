import {
  GRANT_TYPE,
  SCOPE_TYPE,
  OAUTH_CLIENT_ID,
  DEFAULT_METADATA_OPTIONS,
} from './constants';

export const mockMetadata = (
  scope = SCOPE_TYPE.ADMIN,
  resourceType = OAUTH_CLIENT_ID,
) => ({
  oauth_client_scope: {
    get: () => ({
      id: 1,
      oauth_client_id: 1,
      scope,
    }),
  },
  oauth_client_resources: [
    {
      get: () => ({
        id: 1,
        oauth_client_id: 1,
        resource_type: resourceType,
        resource_id: 1,
      }),
    },
  ],
});

export const mockData = {
  MOCK_USER: {
    id: 1,
    roleId: 1,
    name: 'Sharan',
    password: 'pass@123',
    email: 'sharan@wednesday.is',
    oauth_client_id: 1,
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    userType: 'RIDER',
  },

  MOCK_VEHICLE_TYPE: {
    id: 1,
    name: 'Sedan',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_VEHICLE: {
    id: 1,
    name: 'Test Vehicle',
    vehicleTypeId: 1,
    driverId: 1,
    licensePlate: 'MH12AB1234',
    color: 'RED',
    year: 2020,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_VEHICLE_2: {
    id: 2,
    name: 'Test Vehicle 2',
    vehicleTypeId: 1,
    driverId: 1,
    licensePlate: 'MH12AB1234',
    color: 'RED',
    year: 2020,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_PRICING_CONFIG: {
    id: 1,
    baseFare: 5.0,
    perKmRate: 2.0,
    perMinuteRate: 0.5,
    bookingFee: 1.5,
    surgeMultiplier: 1.0,
    effectiveFrom: new Date('2023-01-01'),
    effectiveTo: new Date('2023-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_RATING: {
    id: 1,
    rating: 5,
    comment: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_TRIP: {
    id: 1,
    riderId: 2,
    driverId: 3,
    vehicleId: 4,
    pickupLocation: { type: 'Point', coordinates: [40.7128, -74.006] },
    dropoffLocation: { type: 'Point', coordinates: [34.0522, -118.2437] },
    distance: 2819.4,
    duration: 1680,
    startTime: new Date('2023-05-01T10:00:00Z'),
    endTime: new Date('2023-05-01T10:28:00Z'),
    status: 'completed',
    fare: 35.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_TRIP_2: {
    id: 2,
    riderId: 2,
    driverId: 3,
    vehicleId: 4,
    pickupLocation: { type: 'Point', coordinates: [37.7749, -122.4194] },
    dropoffLocation: { type: 'Point', coordinates: [37.3382, -121.8863] },
    distance: 77.3,
    duration: 60,
    startTime: new Date('2023-05-02T14:00:00Z'),
    endTime: new Date('2023-05-02T15:00:00Z'),
    status: 'completed',
    fare: 42.25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_TRIP_LOCATION: {
    id: 1,
    tripId: 1,
    location: { type: 'Point', coordinates: [40.7128, -74.006] },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_TRIP_LOCATION_2: {
    id: 2,
    tripId: 1,
    location: { type: 'Point', coordinates: [37.7749, -122.4194] },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_DRIVER_LOCATION: {
    id: 1,
    driverId: 1,
    location: { type: 'Point', coordinates: [40.7128, -74.006] },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_PAYMENT: {
    id: 1,
    tripId: 1,
    driverId: 3,
    riderId: 2,
    vehicleId: 4,
    amount: 35.5,
    status: 'completed',
    transactionId: 'txn_123456789',
    paidAt: new Date('2023-05-01T10:30:00Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_PAYMENT_2: {
    id: 2,
    tripId: 2,
    driverId: 3,
    riderId: 2,
    vehicleId: 4,
    amount: 42.25,
    status: 'pending',
    transactionId: null,
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  MOCK_OAUTH_CLIENTS: (metadataOptions = DEFAULT_METADATA_OPTIONS) => ({
    id: 1,
    clientId: 'TEST_CLIENT_ID_1',
    clientSecret: 'TEST_CLIENT_SECRET',
    grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
    ...mockMetadata(metadataOptions.scope, metadataOptions.resourceType),
  }),
  MOCK_OAUTH_CLIENT_TWO: {
    id: 1,
    clientId: 'TEST_CLIENT_ID_1',
    clientSecret: 'TEST_CLIENT_SECRET',
    grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
    ...mockMetadata(SCOPE_TYPE.USER),
  },
  MOCK_OAUTH_CLIENT_SUPER_USER: {
    id: 1,
    clientId: 'TEST_CLIENT_ID_1',
    clientSecret: 'TEST_CLIENT_SECRET',
    grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
    ...mockMetadata(SCOPE_TYPE.SUPER_ADMIN),
  },
  MOCK_OAUTH_CLIENT_RESOURCES: [
    {
      id: 1,
      oauthClientId: 'TEST_CLIENT_ID_1',
      resourceType: 'OAUTH_CLIENT_ID',
      resourceId: 1,
    },
    {
      id: 1,
      oauthClientId: 'TEST_CLIENT_ID_1',
      resourceType: 'OAUTH_CLIENT_ID',
      resourceId: 1,
    },
  ],
  MOCK_OAUTH_CLIENT_SCOPES: {
    id: 1,
    oauthClientId: 'TEST_CLIENT_ID_1',
    scope: SCOPE_TYPE.SUPER_ADMIN,
  },
};

export const createMockTokenWithScope = (
  scope,
  resourceType = OAUTH_CLIENT_ID,
) => ({
  oauthClientId: 'TEST_CLIENT_ID_1',
  metadata: {
    scope: mockMetadata(scope).oauth_client_scope.get(),
    resources: [
      mockMetadata(scope, resourceType).oauth_client_resources[0].get(),
    ],
  },
});
