import { resetAndMockDB } from '@utils/testUtils';
import { Sequelize } from 'sequelize';
import { createMockTokenWithScope } from '@utils/mockData';
import { SCOPE_TYPE, USER_ID } from '@utils/constants';

describe('/drivers route tests ', () => {
  let server;
  const driverId = 'driver-123';
  const mockLocation = {
    id: 'location-123',
    driverId,
    location: 'POINT(35.12345 -71.98765)',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create a mock driver token
  const driverToken = createMockTokenWithScope(SCOPE_TYPE.USER, USER_ID);
  // Create auth object with metadata as a JSON string and userId in metadata
  const driverAuth = {
    credentials: {
      ...driverToken,
      metadata: JSON.stringify({
        userId: driverId,
        scope: driverToken.metadata.scope,
        resources: driverToken.metadata.resources,
      }),
    },
    strategy: 'bearer',
  };

  describe('POST /location route', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it('should validate the request payload', async () => {
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'POST',
        url: '/drivers/location',
        auth: driverAuth,
        payload: {
          // Missing required fields
        },
      });
      expect(res.statusCode).toEqual(400);
    });

    it('should create a new driver location when none exists', async () => {
      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        getDriverLocationByDriverId: jest.fn().mockResolvedValue(null),
        createDriverLocation: jest.fn().mockResolvedValue(mockLocation),
        updateDriverLocation: jest.fn(),
      }));

      // Mock Sequelize.fn
      const mockSequelizeFn = { clone: jest.fn() };
      jest.spyOn(Sequelize, 'fn').mockImplementation(() => mockSequelizeFn);

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'POST',
        url: '/drivers/location',
        auth: driverAuth,
        payload: {
          latitude: 35.12345,
          longitude: -71.98765,
        },
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result).toEqual({
        success: true,
        message: 'Driver location created successfully',
      });

      // Get the mocked functions
      const {
        getDriverLocationByDriverId,
        createDriverLocation,
      } = require('@daos/driverLocationDao');

      // Verify the DAO functions were called with expected arguments
      expect(getDriverLocationByDriverId).toHaveBeenCalledWith(driverId);
      expect(createDriverLocation).toHaveBeenCalledWith(
        expect.objectContaining({
          driverId,
        }),
      );
    });

    it('should update an existing driver location', async () => {
      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        getDriverLocationByDriverId: jest.fn().mockResolvedValue(mockLocation),
        createDriverLocation: jest.fn(),
        updateDriverLocation: jest
          .fn()
          .mockResolvedValue({ driverLocation: [1] }),
      }));

      // Mock Sequelize.fn
      const mockSequelizeFn = { clone: jest.fn() };
      jest.spyOn(Sequelize, 'fn').mockImplementation(() => mockSequelizeFn);

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'POST',
        url: '/drivers/location',
        auth: driverAuth,
        payload: {
          latitude: 35.12345,
          longitude: -71.98765,
        },
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result).toEqual({
        success: true,
        message: 'Driver location updated successfully',
      });

      // Get the mocked functions
      const {
        getDriverLocationByDriverId,
        updateDriverLocation,
      } = require('@daos/driverLocationDao');

      // Verify the DAO functions were called with expected arguments
      expect(getDriverLocationByDriverId).toHaveBeenCalledWith(driverId);
      expect(updateDriverLocation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockLocation.id,
          driverId,
        }),
      );
    });

    it('should return 500 when there is an internal error', async () => {
      // Import and mock the DAO module with error
      jest.doMock('@daos/driverLocationDao', () => ({
        getDriverLocationByDriverId: jest
          .fn()
          .mockRejectedValue(new Error('Test error')),
        createDriverLocation: jest.fn(),
        updateDriverLocation: jest.fn(),
      }));

      // Mock Sequelize.fn
      const mockSequelizeFn = { clone: jest.fn() };
      jest.spyOn(Sequelize, 'fn').mockImplementation(() => mockSequelizeFn);

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'POST',
        url: '/drivers/location',
        auth: driverAuth,
        payload: {
          latitude: 35.12345,
          longitude: -71.98765,
        },
      });

      expect(res.statusCode).toEqual(500);
    });
  });
});
