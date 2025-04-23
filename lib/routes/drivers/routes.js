import {
  createDriverLocation,
  getDriverLocationByDriverId,
  updateDriverLocation,
} from '@daos/driverLocationDao';
import { badImplementation } from '@utils/responseInterceptors';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';

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
];
