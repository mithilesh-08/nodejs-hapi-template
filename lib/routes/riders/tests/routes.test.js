import { resetAndMockDB } from '@utils/testUtils';
import { createMockTokenWithScope } from '@utils/mockData';
import { SCOPE_TYPE, USER_ID } from '@utils/constants';

describe('/riders route tests ', () => {
  let server;
  const riderId = 'rider-123';

  // Mock driver location data
  const mockDriverLocations = [
    {
      id: 'location-1',
      driverId: 'driver-1',
      location: {
        coordinates: [35.12345, -71.98765], // [longitude, latitude]
      },
      driver: {
        id: 'driver-1',
        name: 'Driver One',
        email: 'driver1@example.com',
      },
      dataValues: {
        distance: 500, // 500 meters
      },
    },
    {
      id: 'location-2',
      driverId: 'driver-2',
      location: {
        coordinates: [35.13579, -71.97531], // [longitude, latitude]
      },
      driver: {
        id: 'driver-2',
        name: 'Driver Two',
        email: 'driver2@example.com',
      },
      dataValues: {
        distance: 1200, // 1.2 km
      },
    },
  ];

  // Create a mock rider token
  const riderToken = createMockTokenWithScope(SCOPE_TYPE.USER, USER_ID);
  const riderAuth = {
    credentials: { ...riderToken, userId: riderId },
    strategy: 'bearer',
  };

  describe('GET /nearby-drivers route', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it('should validate the request query parameters', async () => {
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers',
        auth: riderAuth,
        // Don't set query parameters to trigger validation error
      });
      expect(res.statusCode).toEqual(400);
    });

    it('should return nearby drivers when they exist', async () => {
      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        findDriversWithinRadius: jest
          .fn()
          .mockResolvedValue(mockDriverLocations),
      }));

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers?latitude=35.12345&longitude=-71.98765&radius=2',
        auth: riderAuth,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result.success).toEqual(true);
      expect(res.result.message).toEqual('Found 2 drivers in your area');
      expect(res.result.drivers).toHaveLength(2);

      // Verify the first driver details with snake_case field names
      expect(res.result.drivers[0]).toEqual({
        driver_id: 'driver-1',
        name: 'Driver One',
        distance_in_meters: 500,
        location: {
          latitude: -71.98765,
          longitude: 35.12345,
        },
      });

      // Get the mocked function
      const { findDriversWithinRadius } = require('@daos/driverLocationDao');

      // Verify the DAO function was called with expected arguments
      expect(findDriversWithinRadius).toHaveBeenCalledWith(
        35.12345, // latitude
        -71.98765, // longitude
        2, // radius
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: expect.anything(),
              as: 'driver',
              attributes: ['id', 'name', 'email'],
            }),
          ]),
        }),
      );
    });

    it('should return empty array when no drivers are found', async () => {
      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        findDriversWithinRadius: jest.fn().mockResolvedValue([]),
      }));

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers?latitude=35.12345&longitude=-71.98765&radius=2',
        auth: riderAuth,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result.success).toEqual(true);
      expect(res.result.message).toEqual('No drivers found in your area');
      expect(res.result.drivers).toEqual([]);

      // Get the mocked function
      const { findDriversWithinRadius } = require('@daos/driverLocationDao');

      // Verify the DAO function was called with expected arguments
      expect(findDriversWithinRadius).toHaveBeenCalledWith(
        35.12345, // latitude
        -71.98765, // longitude
        2, // radius
        expect.any(Object),
      );
    });

    it('should handle errors when extracting coordinates', async () => {
      // Mock driver location with problematic location data
      const mockProblematicDriverLocations = [
        {
          id: 'location-1',
          driverId: 'driver-1',
          location: null, // Problematic location
          driver: {
            id: 'driver-1',
            name: 'Driver One',
            email: 'driver1@example.com',
          },
          dataValues: {
            distance: 500,
          },
        },
      ];

      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        findDriversWithinRadius: jest
          .fn()
          .mockResolvedValue(mockProblematicDriverLocations),
      }));

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers?latitude=35.12345&longitude=-71.98765&radius=2',
        auth: riderAuth,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result.success).toEqual(true);
      expect(res.result.drivers[0]).toEqual({
        driver_id: 'driver-1',
        name: 'Driver One',
        distance_in_meters: 500,
        location: {
          latitude: 0,
          longitude: 0,
        },
      });
    });

    it('should handle complete error in extracting data', async () => {
      // Mock driver location with completely problematic data
      const mockProblematicDriverLocations = [
        {
          id: 'location-1',
          driverId: 'driver-1',
          location: null,
          driver: null, // Missing driver data
          dataValues: {
            distance: null, // Missing distance
          },
        },
      ];

      // Import and mock the DAO module
      jest.doMock('@daos/driverLocationDao', () => ({
        findDriversWithinRadius: jest
          .fn()
          .mockResolvedValue(mockProblematicDriverLocations),
      }));

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers?latitude=35.12345&longitude=-71.98765&radius=2',
        auth: riderAuth,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result.success).toEqual(true);
      expect(res.result.drivers[0]).toEqual({
        driver_id: 'driver-1',
        name: 'Driver', // Default name
        distance_in_meters: 0, // Default distance
        location: {
          latitude: 0,
          longitude: 0,
        },
      });
    });

    it('should return 500 when there is an internal error', async () => {
      // Import and mock the DAO module with error
      jest.doMock('@daos/driverLocationDao', () => ({
        findDriversWithinRadius: jest
          .fn()
          .mockRejectedValue(new Error('Test error')),
      }));

      // Initialize the server
      server = await resetAndMockDB();

      const res = await server.inject({
        method: 'GET',
        url: '/riders/nearby-drivers?latitude=35.12345&longitude=-71.98765&radius=2',
        auth: riderAuth,
      });

      expect(res.statusCode).toEqual(500);
    });
  });
});
