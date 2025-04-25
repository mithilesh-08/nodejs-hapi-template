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
  return driverLocation;
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
  page = 1,
  limit = 10,
  options = {},
) => {
  // Create a simple Point geometry without the CRS property
  const point = { type: 'Point', coordinates: [longitude, latitude] };

  const offset = (page - 1) * limit;

  // Use ST_SRID explicitly on both geometries to ensure they match
  const result = await models.driverLocations.findAndCountAll({
    attributes: {
      include: [
        [
          Sequelize.fn(
            'ST_Distance_Sphere',
            Sequelize.fn('ST_SRID', Sequelize.col('location'), 0),
            Sequelize.fn(
              'ST_SRID',
              Sequelize.fn(
                'ST_GeomFromGeoJSON',
                Sequelize.literal(`'${JSON.stringify(point)}'`),
              ),
              0,
            ),
          ),
          'distance',
        ],
      ],
    },
    where: Sequelize.and(
      Sequelize.where(
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.fn('ST_SRID', Sequelize.col('location'), 0),
          Sequelize.fn(
            'ST_SRID',
            Sequelize.fn(
              'ST_GeomFromGeoJSON',
              Sequelize.literal(`'${JSON.stringify(point)}'`),
            ),
            0,
          ),
        ),
        '<=',
        radiusInKm * 1000, // meters
      ),
      { isAvailable: true },
    ),
    order: [
      [
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.fn('ST_SRID', Sequelize.col('location'), 0),
          Sequelize.fn(
            'ST_SRID',
            Sequelize.fn(
              'ST_GeomFromGeoJSON',
              Sequelize.literal(`'${JSON.stringify(point)}'`),
            ),
            0,
          ),
        ),
        'ASC',
      ],
    ],
    limit,
    offset,
    ...options,
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    total: Math.ceil(result.count / limit),
  };
};
