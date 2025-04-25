import { findDriversWithinRadius } from '@daos/driverLocationDao';
import { badImplementation } from '@utils/responseInterceptors';
import Joi from 'joi';
import { models } from '@models';
import extractCoordinate from '@utils/cordinateExtractionUtil';
import { storeTripRequest } from '@utils/tripRequestsRedisUtils';
import { v4 as uuidv4 } from 'uuid';
import { findTripById } from '@daos/tripDao';
import { createPayment } from '@daos/paymentDao';

export default [
  {
    method: 'GET',
    path: '/nearby-drivers',
    options: {
      description: 'Find nearby drivers',
      notes: 'GET nearby drivers API',
      tags: ['api', 'riders'],
      validate: {
        query: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          radius: Joi.number().default(2),
          page: Joi.number().default(1),
          limit: Joi.number().default(10),
        }),
      },
    },
    handler: async (request) => {
      try {
        const { latitude, longitude, radius, page, limit } = request.query;

        // Validate coordinate values
        const lat = parseFloat(latitude);
        const long = parseFloat(longitude);

        // Check if coordinates are within valid geographic ranges
        if (lat < -90 || lat > 90 || long < -180 || long > 180) {
          return badImplementation(
            `Warning: Coordinates may be out of range or swapped: lat=${lat}, long=${long}`,
          );
        }

        // Find drivers within the specified radius
        const nearbyDrivers = await findDriversWithinRadius(
          lat,
          long,
          radius,
          page,
          limit,
          {
            include: [
              {
                model: models.users,
                as: 'driver',
                attributes: ['id', 'name', 'email'],
              },
            ],
          },
        );

        if (!nearbyDrivers || nearbyDrivers.rows.length === 0) {
          return {
            success: true,
            message: 'No drivers found in your area',
            drivers: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
            },
          };
        }

        // Transform the results to include distance in kilometers
        const formattedDrivers = nearbyDrivers.rows.map((driverLocation) => {
          try {
            return {
              driverId: driverLocation.driverId,
              name: driverLocation.driver?.name || 'Driver',
              distanceInMeters: parseFloat(
                driverLocation.dataValues.distance || 0,
              ),
              // Use a safe approach to extract coordinates
              location: {
                latitude: extractCoordinate(driverLocation.location, 1),
                longitude: extractCoordinate(driverLocation.location, 0),
              },
            };
          } catch (error) {
            // Return a basic record if there's an error
            return {
              driverId: driverLocation.driverId,
              name: driverLocation.driver?.name || 'Driver',
              distanceInMeters: 0,
              location: { latitude: 0, longitude: 0 },
            };
          }
        });

        return {
          success: true,
          message: `Found ${formattedDrivers.length} drivers in your area`,
          drivers: formattedDrivers,
          pagination: {
            page: nearbyDrivers.page,
            limit,
            total: nearbyDrivers.count,
            totalPages: nearbyDrivers.total,
          },
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },
  {
    method: 'POST',
    path: '/trip-request',
    options: {
      description: 'Request a trip',
      notes: 'Request a trip API',
      tags: ['api', 'riders'],
      validate: {
        payload: Joi.object({
          pickup: Joi.object({
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            address: Joi.string().required(),
          }).required(),
          dropoff: Joi.object({
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            address: Joi.string().required(),
          }).required(),
        }),
      },
      handler: async (request) => {
        try {
          const metadata = JSON.parse(request.auth.credentials.metadata);

          const riderId = metadata.userId;

          const { pickup, dropoff } = request.payload;

          const tripRequest = await storeTripRequest({
            id: uuidv4(),
            pickup,
            dropoff,
            riderId,
          });
          return {
            success: true,
            message: 'Trip request created successfully',
            tripRequest,
          };
        } catch (error) {
          //   console.error(error);
          return badImplementation(error.message);
        }
      },
    },
  },
  {
    method: 'POST',
    path: 'make-payment',
    options: {
      description: 'Make payment',
      notes: 'Make payment API',
      tags: ['api', 'riders'],
      validate: {
        payload: Joi.object({
          tripId: Joi.string().required(),
          paymentMethod: Joi.string().required(),
        }),
      },
      handler: async (request) => {
        try {
          const metadata = JSON.parse(request.auth.credentials.metadata);
          const riderId = metadata.userId;
          const { tripId, paymentMethod } = request.payload;
          const trip = await findTripById(tripId);

          if (!trip) {
            return badImplementation('Trip not found');
          }

          if (trip.riderId !== riderId) {
            return badImplementation('Trip not found');
          }

          if (trip.status !== 'completed') {
            return badImplementation('Trip is not completed');
          }

          trip.status = 'completed';
          await trip.save();
          const payment = await createPayment({
            id: uuidv4(),
            tripId,
            driverId: trip.driverId,
            riderId,
            vehicleId: trip.vehicleId,
            amount: trip.fare,
            paymentMethod,
            status: 'pending',
          });

          return {
            success: true,
            message: 'Payment created successfully',
            payment,
          };
        } catch (error) {
          return badImplementation(error.message);
        }
      },
    },
  },
];
