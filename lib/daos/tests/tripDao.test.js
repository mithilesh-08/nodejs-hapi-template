import { resetAndMockDB } from '@utils/testUtils';

describe('Trip DAO', () => {
  describe('createTrip', () => {
    it('should call create with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'create');
      });
      const { createTrip } = require('@daos/tripDao');
      const tripProps = {
        riderId: 2,
        driverId: 3,
        vehicleId: 4,
        pickupLocation: { type: 'Point', coordinates: [40.7128, -74.006] },
        dropoffLocation: { type: 'Point', coordinates: [34.0522, -118.2437] },
        distance: 50.5,
        duration: 60,
        startTime: new Date(),
        endTime: new Date(),
        status: 'completed',
        fare: 25.5,
      };

      const trip = await createTrip(tripProps);

      expect(spy).toHaveBeenCalledWith(tripProps, {});

      // Verify the returned data structure
      expect(trip).toBeDefined();
      expect(trip).toHaveProperty('id');
      expect(trip).toHaveProperty('riderId', tripProps.riderId);
      expect(trip).toHaveProperty('driverId', tripProps.driverId);
      expect(trip).toHaveProperty('vehicleId', tripProps.vehicleId);
    });
  });

  describe('updateTrip', () => {
    it('should call update with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'update');
      });
      const { updateTrip } = require('@daos/tripDao');
      const tripProps = {
        id: 1,
        status: 'cancelled',
      };

      await updateTrip(tripProps);

      expect(spy).toHaveBeenCalledWith(tripProps, {});
    });
  });

  describe('findTripById', () => {
    it('should call findOne with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'findOne');
      });
      const { findTripById } = require('@daos/tripDao');
      const tripId = 1;

      const trip = await findTripById(tripId);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { id: tripId },
      });

      // Verify the returned data structure
      expect(trip).toBeDefined();
      expect(trip).toHaveProperty('id');
      expect(trip).toHaveProperty('riderId');
      expect(trip).toHaveProperty('driverId');
      expect(trip).toHaveProperty('status');
    });
  });

  describe('findTrips', () => {
    it('should call findAndCountAll with the correct parameters for finding by riderId', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'findAndCountAll');
      });
      const { findTrips } = require('@daos/tripDao');
      const riderId = 2;

      const result = await findTrips({ riderId });

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { riderId },
        limit: 10,
        offset: 0,
      });

      // Verify the returned data structure
      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0]).toHaveProperty('riderId', riderId);
    });

    it('should call findAndCountAll with the correct parameters for finding by driverId', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'findAndCountAll');
      });
      const { findTrips } = require('@daos/tripDao');
      const driverId = 3;

      const result = await findTrips({ driverId });

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { driverId },
        limit: 10,
        offset: 0,
      });

      // Verify the returned data structure
      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0]).toHaveProperty('driverId', driverId);
    });

    it('should call findAndCountAll with the correct parameters for finding by vehicleId', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'findAndCountAll');
      });
      const { findTrips } = require('@daos/tripDao');
      const vehicleId = 4;

      const result = await findTrips({ vehicleId });

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { vehicleId },
        limit: 10,
        offset: 0,
      });

      // Verify the returned data structure
      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0]).toHaveProperty('vehicleId', vehicleId);
    });

    it('should call findAndCountAll with multiple criteria and options', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.trips, 'findAndCountAll');
      });
      const { findTrips } = require('@daos/tripDao');
      const criteria = {
        riderId: 2,
        status: 'completed',
      };
      const options = {
        order: [['startTime', 'DESC']],
      };

      const result = await findTrips(criteria, 1, 10, options);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: criteria,
        limit: 10,
        offset: 0,
        order: [['startTime', 'DESC']],
      });

      // Verify the returned data structure
      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('riderId', criteria.riderId);
      expect(result.rows[0]).toHaveProperty('status', criteria.status);
    });
  });
});
