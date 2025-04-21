import { models } from '@models';

const tripLocationAttributes = [
  'id',
  'tripId',
  'location',
  'createdAt',
  'updatedAt',
];

export const createTripLocation = async (tripLocationProps, options = {}) => {
  const tripLocation = await models.tripLocations.create(
    { ...tripLocationProps },
    options,
  );
  return tripLocation;
};

/**
 * Generic function to find trip locations by any field
 * @param {Object} where - Object containing field-value pairs to search by
 * @param {Object} options - Additional options for the query
 * @returns {Promise<Array>} - Promise resolving to array of trip locations
 */
export const findTripLocations = async (where = {}, options = {}) => {
  const tripLocations = await models.tripLocations.findAll({
    attributes: tripLocationAttributes,
    where,
    ...options,
  });
  return tripLocations;
};

export const getAllTripLocationsByTripId = async (tripId, options = {}) =>
  findTripLocations({ tripId }, options);
