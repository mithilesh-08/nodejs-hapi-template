import { findDriversWithinRadius } from '@daos/driverLocationDao';
import { badImplementation } from '@utils/responseInterceptors';
import Joi from 'joi';
import { models } from '@models';
import extractCoordinate from '@utils/cordinateExtractionUtil';

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
        }),
      },
    },
    handler: async (request) => {
      try {
        const { latitude, longitude, radius } = request.query;

        // Find drivers within the specified radius
        const nearbyDrivers = await findDriversWithinRadius(
          latitude,
          longitude,
          radius,
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

        if (!nearbyDrivers || nearbyDrivers.length === 0) {
          return {
            success: true,
            message: 'No drivers found in your area',
            drivers: [],
          };
        }

        // Transform the results to include distance in kilometers
        const formattedDrivers = nearbyDrivers.map((driverLocation) => {
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
        };
      } catch (error) {
        console.error(error);
        return badImplementation(error.message);
      }
    },
  },
];
