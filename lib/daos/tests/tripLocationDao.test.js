import { resetAndMockDB } from '@utils/testUtils';
import { Op } from 'sequelize';

describe('TripLocation DAO', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('createTripLocation', () => {
    it('should create a trip location with correct properties', async () => {
      await resetAndMockDB();
      const { createTripLocation } = require('@daos/tripLocationDao');

      const tripLocationProps = {
        tripId: 1,
        location: { type: 'Point', coordinates: [40.7128, -74.006] },
      };

      const tripLocation = await createTripLocation(tripLocationProps);

      // Check return values instead of spy calls
      expect(tripLocation).toBeDefined();
      expect(tripLocation).toHaveProperty('id');
      expect(tripLocation).toHaveProperty('tripId', tripLocationProps.tripId);
      expect(tripLocation).toHaveProperty(
        'location',
        tripLocationProps.location,
      );
    });
  });

  describe('getAllTripLocationsByTripId', () => {
    it('should get all trip locations by trip id', async () => {
      await resetAndMockDB();
      const { getAllTripLocationsByTripId } = require('@daos/tripLocationDao');

      const tripId = 1;
      const tripLocations = await getAllTripLocationsByTripId(tripId);

      // Check return values instead of spy calls
      expect(Array.isArray(tripLocations)).toBe(true);
      expect(tripLocations.length).toBeGreaterThan(0);
      expect(tripLocations[0]).toHaveProperty('id');
      expect(tripLocations[0]).toHaveProperty('tripId', tripId);
      expect(tripLocations[0]).toHaveProperty('location');
    });

    it('should accept options parameter', async () => {
      await resetAndMockDB();
      const { getAllTripLocationsByTripId } = require('@daos/tripLocationDao');

      const tripId = 1;
      const options = {
        order: [['createdAt', 'DESC']],
        limit: 5,
      };

      const tripLocations = await getAllTripLocationsByTripId(tripId, options);

      expect(Array.isArray(tripLocations)).toBe(true);
      expect(tripLocations.length).toBeGreaterThan(0);
      expect(tripLocations[0]).toHaveProperty('tripId', tripId);
    });
  });

  describe('findTripLocations', () => {
    it('should accept options parameter', async () => {
      await resetAndMockDB();
      const { findTripLocations } = require('@daos/tripLocationDao');

      const where = { tripId: 1 };
      const options = {
        order: [['createdAt', 'DESC']],
        limit: 5,
      };

      const tripLocations = await findTripLocations(where, options);

      expect(Array.isArray(tripLocations)).toBe(true);
      expect(tripLocations.length).toBeGreaterThan(0);
      expect(tripLocations[0]).toHaveProperty('tripId', where.tripId);
    });

    it('should find trip locations by multiple criteria', async () => {
      await resetAndMockDB();
      const { findTripLocations } = require('@daos/tripLocationDao');

      const where = {
        tripId: 1,
      };

      const tripLocations = await findTripLocations(where);

      expect(Array.isArray(tripLocations)).toBe(true);
      expect(tripLocations.length).toBeGreaterThan(0);
      expect(tripLocations[0]).toHaveProperty('tripId', where.tripId);
    });

    it('should find trip the given time range', async () => {
      await resetAndMockDB();
      const { findTripLocations } = require('@daos/tripLocationDao');

      const where = {
        tripId: 1,
        createdAt: {
          [Op.between]: [new Date('2023-01-01'), new Date('2023-01-05')],
        },
      };

      const tripLocations = await findTripLocations(where);

      expect(Array.isArray(tripLocations)).toBe(true);
      expect(tripLocations.length).toBeGreaterThan(0);
      expect(tripLocations[0]).toHaveProperty('tripId', where.tripId);
      expect(tripLocations[0]).toHaveProperty('createdAt');
    });
  });
});
