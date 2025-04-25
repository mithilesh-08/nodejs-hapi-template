import {
  createDriverLocation,
  getDriverLocationByDriverId,
  updateDriverLocation,
} from '@daos/driverLocationDao';
import { badImplementation, notFound } from '@utils/responseInterceptors';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import {
  deleteTripRequest,
  getTripRequestById,
  getTripRequestsNearby,
} from '@utils/tripRequestsRedisUtils';
import { createTrip } from '@daos/tripDao';
import calculateDistanceAndFare from '@utils/tripUtils';
import { createVehicle } from '@daos/vehicleDao';
import { models } from '@models';

export default [
  {
    method: 'POST',
    path: '/location',
    options: {
      description: 'Update driver current location',
      notes: 'POST driver location update API',
      tags: ['api', 'drivers'],
      validate: {
        payload: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
        }),
      },
    },
    handler: async (request) => {
      try {
        // Parse the metadata JSON string to an object
        const metadata = JSON.parse(request.auth.credentials.metadata);

        // Get userId from parsed metadata
        const driverId = metadata.userId;

        const { latitude, longitude } = request.payload;

        // Create a point using Sequelize.fn to properly handle MySQL POINT type
        const location = Sequelize.fn(
          'ST_GeomFromText',
          `POINT(${longitude} ${latitude})`,
          0, // Explicitly set SRID to 0
        );

        // Check if driver location already exists
        const existingLocation = await getDriverLocationByDriverId(driverId);

        if (existingLocation) {
          // Update existing location
          await updateDriverLocation({
            id: existingLocation.id,
            driverId,
            location,
          });

          return {
            success: true,
            message: 'Driver location updated successfully',
          };
        }

        // Create new location record
        await createDriverLocation({
          id: uuidv4(),
          driverId,
          location,
        });

        return {
          success: true,
          message: 'Driver location created successfully',
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },

  {
    method: 'POST',
    path: '/add-vehicle',
    options: {
      description: 'Add a vehicle',
      notes: 'POST add vehicle API',
      tags: ['api', 'drivers'],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          vehicleTypeId: Joi.string().required(),
          licensePlate: Joi.string().required(),
          color: Joi.string().required(),
          year: Joi.number().required(),
        }),
      },
    },
    handler: async (request) => {
      try {
        const metadata = JSON.parse(request.auth.credentials.metadata);
        const driverId = metadata.userId;

        const { name, vehicleTypeId, licensePlate, color, year } =
          request.payload;
        const vehicle = await createVehicle({
          id: uuidv4(),
          name,
          vehicleTypeId,
          licensePlate,
          color,
          year,
          driverId,
        });
        return {
          success: true,
          message: 'Vehicle added successfully',
          vehicle,
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },
  {
    method: 'GET',
    path: '/get-nearby-trips',
    options: {
      description: 'Get nearby trips',
      notes: 'GET nearby trips API',
      tags: ['api', 'drivers'],
      validate: {
        query: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          radius: Joi.number().required(),
          limit: Joi.number().required(),
        }),
      },
    },
    handler: async (request) => {
      try {
        const { latitude, longitude, radius, limit } = request.query;
        const nearbyTrips = await getTripRequestsNearby(
          longitude,
          latitude,
          radius,
          limit,
        );
        return {
          success: true,
          message: 'Nearby trips fetched successfully',
          trips: nearbyTrips,
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },
  {
    method: 'POST',
    path: '/accept-trip',
    options: {
      description: 'Accept a trip',
      notes: 'POST accept trip API',
      tags: ['api', 'drivers'],
      validate: {
        payload: Joi.object({
          tripRequestId: Joi.string().required(),
          vehicleId: Joi.string().required(),
        }),
      },
    },
    handler: async (request) => {
      const transaction = await models.sequelize.transaction();
      try {
        const { tripRequestId, vehicleId } = request.payload;

        const metadata = JSON.parse(request.auth.credentials.metadata);

        if (!metadata.userId) {
          return badImplementation('User ID not found in credentials');
        }
        const driverId = metadata.userId;

        // Get and validate trip request
        const tripRequest = await getTripRequestById(tripRequestId);
        if (!tripRequest) {
          await transaction.rollback();
          return notFound('Trip request not found or already accepted');
        }

        try {
          const { pickup, dropoff } = tripRequest;
          if (!pickup || !dropoff) {
            await transaction.rollback();
            return badImplementation('Invalid pickup or dropoff locations');
          }

          const result = await calculateDistanceAndFare(pickup, dropoff);
          const { distance, fare } = result;

          // Create Point objects for pickup and dropoff locations
          const pickupLocation = Sequelize.fn(
            'ST_GeomFromText',
            `POINT(${pickup.longitude} ${pickup.latitude})`,
            0, // Explicitly set SRID to 0
          );

          const dropoffLocation = Sequelize.fn(
            'ST_GeomFromText',
            `POINT(${dropoff.longitude} ${dropoff.latitude})`,
            0, // Explicitly set SRID to 0
          );
          // Create the trip
          const trip = await createTrip(
            {
              id: uuidv4(),
              driverId,
              riderId: tripRequest.riderId,
              vehicleId,
              pickupLocation,
              dropoffLocation,
              distance,
              fare,
              startTime: new Date(),
              status: 'accepted',
            },
            { transaction },
          );

          // Delete the trip request
          await deleteTripRequest(tripRequestId);

          await updateDriverLocation(
            {
              driverId,
              isAvailable: false,
            },
            { transaction },
          );

          await transaction.commit();
          return {
            success: true,
            message: 'Trip accepted successfully',
            trip,
          };
        } catch (error) {
          await transaction.rollback();
          return badImplementation(error.message);
        }
      } catch (error) {
        await transaction.rollback();
        return badImplementation(error.message);
      }
    },
  },
];
