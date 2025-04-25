const { models } = require('@models');

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
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @param {Object} options - Additional options for the query
 * @returns {Promise<Object>} - Object with count, rows, page, and total properties
 */
export const findTripLocations = async (
  where = {},
  page = 1,
  limit = 10,
  options = {},
) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await models.tripLocations.findAndCountAll({
    attributes: tripLocationAttributes,
    where,
    limit,
    offset,
    ...options,
  });

  return {
    count,
    rows,
    page,
    total: Math.ceil(count / limit),
  };
};

export const getAllTripLocationsByTripId = async (
  tripId,
  page = 1,
  limit = 10,
  options = {},
) => findTripLocations({ tripId }, page, limit, options);
