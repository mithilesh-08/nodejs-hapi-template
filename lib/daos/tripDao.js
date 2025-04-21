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

export const findTrips = async (where = {}, options = {}) => {
  const trips = await models.trips.findAll({
    attributes: tripAttributes,
    where,
    ...options,
  });
  return trips;
};
