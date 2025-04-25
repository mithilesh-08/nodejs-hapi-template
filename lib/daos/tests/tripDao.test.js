import { resetAndMockDB } from '@utils/testUtils';
import { models } from '@models';
import { findTrips } from '@daos/tripDao';

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
      const riderId = 2;
      const page = 1;
      const limit = 10;

      const spy = jest
        .spyOn(models.trips, 'findAndCountAll')
        .mockResolvedValue({
          count: 1,
          rows: [{ id: 1, riderId }],
        });

      const result = await findTrips({ riderId }, page, limit);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { riderId },
        limit,
        offset: 0,
      });

      expect(result.count).toBe(1);
      expect(result.rows[0].riderId).toBe(riderId);

      spy.mockRestore();
    });

    it('should call findAndCountAll with the correct parameters for finding by driverId', async () => {
      const driverId = 3;
      const page = 1;
      const limit = 10;

      const spy = jest
        .spyOn(models.trips, 'findAndCountAll')
        .mockResolvedValue({
          count: 1,
          rows: [{ id: 1, driverId }],
        });

      const result = await findTrips({ driverId }, page, limit);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { driverId },
        limit,
        offset: 0,
      });

      expect(result.count).toBe(1);
      expect(result.rows[0].driverId).toBe(driverId);

      spy.mockRestore();
    });

    it('should call findAndCountAll with the correct parameters for finding by vehicleId', async () => {
      const vehicleId = 4;
      const page = 1;
      const limit = 10;

      const spy = jest
        .spyOn(models.trips, 'findAndCountAll')
        .mockResolvedValue({
          count: 1,
          rows: [{ id: 1, vehicleId }],
        });

      const result = await findTrips({ vehicleId }, page, limit);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { vehicleId },
        limit,
        offset: 0,
      });

      expect(result.count).toBe(1);
      expect(result.rows[0].vehicleId).toBe(vehicleId);

      spy.mockRestore();
    });

    it('should call findAndCountAll with multiple criteria and options', async () => {
      const criteria = { riderId: 2, status: 'completed' };
      const page = 1;
      const limit = 10;
      const options = { order: [['startTime', 'DESC']] };

      const spy = jest
        .spyOn(models.trips, 'findAndCountAll')
        .mockResolvedValue({
          count: 1,
          rows: [{ id: 1, ...criteria }],
        });

      const result = await findTrips(criteria, page, limit, options);

      expect(spy).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: criteria,
        order: [['startTime', 'DESC']],
        limit,
        offset: 0,
      });

      expect(result.count).toBe(1);
      expect(result.rows[0].riderId).toBe(criteria.riderId);
      expect(result.rows[0].status).toBe(criteria.status);

      spy.mockRestore();
    });
  });
});
