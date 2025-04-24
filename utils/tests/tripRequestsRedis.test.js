import { v4 as uuidv4 } from 'uuid';

// Mock Redis client methods
const mockStart = jest.fn().mockResolvedValue();
const mockSet = jest
  .fn()
  .mockResolvedValue({ id: 'someKey', stored: 'success' });
const mockGet = jest.fn();
const mockDrop = jest.fn().mockResolvedValue(true);

// Mock raw Redis commands
const mockGeoadd = jest.fn().mockResolvedValue(1);
const mockGeoradius = jest.fn();
const mockZrem = jest.fn().mockResolvedValue(1);

// Mock CatboxRedis
jest.mock('@hapi/catbox-redis', () => ({
  Engine: jest.fn().mockImplementation(() => ({
    start: mockStart,
    set: mockSet,
    get: mockGet,
    drop: mockDrop,
    client: {
      geoadd: mockGeoadd,
      georadius: mockGeoradius,
      zrem: mockZrem,
    },
  })),
}));

// Sample trip request data
const sampleTripRequest = {
  id: uuidv4(),
  riderId: uuidv4(),
  pickup: {
    latitude: 20.456,
    longitude: 10.123,
    address: '123 Test St',
  },
  dropoff: {
    latitude: 21.567,
    longitude: 11.234,
    address: '456 Example Ave',
  },
  price: 15.5,
  distance: 5.2, // km
  estimatedDuration: 15, // minutes
};

describe('Trip Requests Redis DAO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeTripRequest', () => {
    it('should store a trip request in Redis', async () => {
      const { storeTripRequest } = require('../tripRequestsRedisUtils');

      const result = await storeTripRequest(sampleTripRequest);

      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining('trip:requests:'),
          segment: 'tripRequests',
        }),
        expect.any(String),
        300000, // 300 seconds in milliseconds
      );

      expect(mockGeoadd).toHaveBeenCalledWith(
        'trip:requests:geo',
        sampleTripRequest.pickup.longitude,
        sampleTripRequest.pickup.latitude,
        sampleTripRequest.id,
      );

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
    });

    it('should handle errors gracefully', async () => {
      mockSet.mockRejectedValueOnce(new Error('Redis error'));

      const { storeTripRequest } = require('../tripRequestsRedisUtils');

      await expect(storeTripRequest(sampleTripRequest)).rejects.toThrow(
        'Redis error',
      );
    });
  });

  describe('getTripRequestsNearby', () => {
    it('should get trip requests within a radius', async () => {
      const mockGeoResults = [
        [sampleTripRequest.id, '1.5'], // [id, distance in km]
      ];
      mockGeoradius.mockResolvedValueOnce(mockGeoResults);

      // Mock the Catbox get result
      mockGet.mockResolvedValueOnce({
        item: JSON.stringify(sampleTripRequest),
        stored: Date.now(),
        ttl: 300000,
      });

      const { getTripRequestsNearby } = require('../tripRequestsRedisUtils');

      const longitude = 10.0;
      const latitude = 20.0;
      const radiusInKm = 5;

      const results = await getTripRequestsNearby(
        longitude,
        latitude,
        radiusInKm,
      );

      expect(mockGeoradius).toHaveBeenCalledWith(
        'trip:requests:geo',
        longitude,
        latitude,
        radiusInKm,
        'km',
        'WITHDIST',
        'ASC',
        'COUNT',
        20, // default limit
      );

      expect(mockGet).toHaveBeenCalledWith({
        id: `trip:requests:${sampleTripRequest.id}`,
        segment: 'tripRequests',
      });

      expect(results.length).toBe(1);
      expect(results[0].id).toBe(sampleTripRequest.id);
      expect(results[0].distance).toBe(1.5);
    });

    it('should return empty array when no results found', async () => {
      mockGeoradius.mockResolvedValueOnce([]);

      const { getTripRequestsNearby } = require('../tripRequestsRedisUtils');

      const results = await getTripRequestsNearby(10, 20, 5);

      expect(results).toEqual([]);
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('getTripRequestById', () => {
    it('should get a trip request by ID', async () => {
      mockGet.mockResolvedValueOnce({
        item: JSON.stringify(sampleTripRequest),
        stored: Date.now(),
        ttl: 300000,
      });

      const { getTripRequestById } = require('../tripRequestsRedisUtils');

      const result = await getTripRequestById(sampleTripRequest.id);

      expect(mockGet).toHaveBeenCalledWith({
        id: `trip:requests:${sampleTripRequest.id}`,
        segment: 'tripRequests',
      });

      expect(result).toEqual(sampleTripRequest);
    });

    it('should return null if trip request not found', async () => {
      mockGet.mockResolvedValueOnce(null);

      const { getTripRequestById } = require('../tripRequestsRedisUtils');

      const result = await getTripRequestById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('deleteTripRequest', () => {
    it('should delete a trip request', async () => {
      const { deleteTripRequest } = require('../tripRequestsRedisUtils');

      const result = await deleteTripRequest(sampleTripRequest.id);

      expect(mockZrem).toHaveBeenCalledWith(
        'trip:requests:geo',
        sampleTripRequest.id,
      );
      expect(mockDrop).toHaveBeenCalledWith({
        id: `trip:requests:${sampleTripRequest.id}`,
        segment: 'tripRequests',
      });

      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      mockZrem.mockRejectedValueOnce(new Error('Redis error'));

      const { deleteTripRequest } = require('../tripRequestsRedisUtils');

      const result = await deleteTripRequest(sampleTripRequest.id);

      expect(result).toBe(false);
    });
  });
});
