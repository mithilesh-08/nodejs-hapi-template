const { models } = require('@models');
const { Sequelize } = require('sequelize');

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
  // Create a Point geometry
  const point = { type: 'Point', coordinates: [longitude, latitude] };

  const drivers = await models.driverLocations.findAll({
    attributes: {
      include: [
        [
          Sequelize.fn(
            'ST_Distance_Sphere',
            Sequelize.col('location'),
            Sequelize.fn(
              'ST_GeomFromGeoJSON',
              Sequelize.literal(`'${JSON.stringify(point)}'`),
            ),
          ),
          'distance',
        ],
      ],
    },
    where: Sequelize.where(
      Sequelize.fn(
        'ST_Distance_Sphere',
        Sequelize.col('location'),
        Sequelize.fn(
          'ST_GeomFromGeoJSON',
          Sequelize.literal(`'${JSON.stringify(point)}'`),
        ),
      ),
      '<=',
      radiusInKm * 1000, // meters
    ),
    order: [
      [
        Sequelize.fn(
          'distance',
          Sequelize.col('location'),
          Sequelize.literal(`'${JSON.stringify(point)}'`),
        ),
        'ASC',
      ],
    ],
    ...options,
  });

  return drivers;
};
