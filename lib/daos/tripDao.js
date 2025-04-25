import { models } from '@models';

const tripAttributes = [
  'id',
  'riderId',
  'driverId',
  'vehicleId',
  'pickupLocation',
  'dropoffLocation',
  'distance',
  'duration',
  'startTime',
  'endTime',
  'status',
  'fare',
  'createdAt',
  'updatedAt',
];

export const createTrip = async (tripProps, options = {}) => {
  const trip = await models.trips.create(tripProps, options);
  return trip;
};

export const updateTrip = async (tripProps, options = {}) => {
  const trip = await models.trips.update(tripProps, options);
  return trip;
};

export const findTripById = async (id, options = {}) => {
  const trip = await models.trips.findOne({
    attributes: tripAttributes,
    where: { id },
    ...options,
  });
  return trip;
};

export const findTrips = async (
  where = {},
  page = 1,
  limit = 10,
  options = {},
) => {
  const offset = (page - 1) * limit;

  const result = await models.trips.findAndCountAll({
    attributes: tripAttributes,
    where,
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
