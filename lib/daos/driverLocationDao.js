import { models } from '@models';
import { Sequelize } from 'sequelize';

export const createDriverLocation = async (
  driverLocationProps,
  options = {},
) => {
  const driverLocation = await models.driverLocations.create(
    { ...driverLocationProps },
    options,
  );
  return driverLocation;
};

export const updateDriverLocation = async (
  driverLocationProps,
  options = {},
) => {
  const driverLocation = await models.driverLocations.update(
    driverLocationProps,
    {
      where: { id: driverLocationProps.id },
      ...options,
    },
  );
  return { driverLocation };
};

export const getDriverLocationByDriverId = async (driverId, options = {}) => {
  const driverLocation = await models.driverLocations.findOne({
    where: { driverId },
    ...options,
  });
  return driverLocation;
};

export const findDriversWithinRadius = async (
  latitude,
  longitude,
  radiusInKm = 2,
  options = {},
) => {
  // Create the point as a Well-Known Text (WKT) format
  const pointWkt = `POINT(${longitude} ${latitude})`;

  const drivers = await models.driverLocations.findAll({
    attributes: {
      include: [
        [
          Sequelize.fn(
            'ST_Distance_Sphere',
            Sequelize.col('location'),
            Sequelize.fn('ST_GeomFromText', pointWkt),
          ),
          'distance',
        ],
      ],
    },
    where: Sequelize.where(
      Sequelize.fn(
        'ST_Distance_Sphere',
        Sequelize.col('location'),
        Sequelize.fn('ST_GeomFromText', pointWkt),
      ),
      '<=',
      radiusInKm * 1000, // meters
    ),
    order: [
      [
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.col('location'),
          Sequelize.fn('ST_GeomFromText', pointWkt),
        ),
        'ASC',
      ],
    ],
    ...options,
  });

  return drivers;
};
