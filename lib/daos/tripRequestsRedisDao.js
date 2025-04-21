import { v4 as uuidv4 } from 'uuid';
import CatboxRedis from '@hapi/catbox-redis';

// Key prefix for trip requests
const TRIP_REQUESTS_PREFIX = 'trip:requests';
// Expiration time for trip requests (in seconds)
const TRIP_REQUEST_EXPIRY = 300; // 5 minutes

// Redis client singleton
let redisClient = null;

// Helper function to get Redis client
const getRedisClient = async () => {
  // Return existing client if already initialized
  if (redisClient) {
    return redisClient;
  }

  // Create a new Redis client using the same configuration as in cacheConstants.js
  const client = new CatboxRedis.Engine({
    partition: 'temp_dev_data',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  });

  // Initialize the client
  await client.start();
  redisClient = client;
  return client;
};

/**
 * Store a trip request in Redis
 * @param {Object} tripRequest - Trip request data
 * @param {string} [tripRequest.id] - Unique ID for the trip request (generated if not provided)
 * @param {Object} tripRequest.pickup - Pickup location
 * @param {Object} tripRequest.dropoff - Dropoff location
 * @param {string} tripRequest.riderId - ID of the rider
 * @param {number} [expiry=TRIP_REQUEST_EXPIRY] - Expiration time in seconds
 * @returns {Promise<Object>} - Stored trip request with ID
 */
export const storeTripRequest = async (
  tripRequest,
  expiry = TRIP_REQUEST_EXPIRY,
) => {
  try {
    const client = await getRedisClient();
    const tripRequestData = {
      ...tripRequest,
      id: tripRequest.id || uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const key = `${TRIP_REQUESTS_PREFIX}:${tripRequestData.id}`;
    await client.set(
      { id: key, segment: 'tripRequests' },
      JSON.stringify(tripRequestData),
      expiry * 1000,
    ); // Catbox expects milliseconds

    // Add to geospatial index for location-based queries using raw Redis commands
    await client.connection.client.geoadd(
      `${TRIP_REQUESTS_PREFIX}:geo`,
      tripRequestData.pickup.coordinates[0], // longitude
      tripRequestData.pickup.coordinates[1], // latitude
      tripRequestData.id,
    );

    return tripRequestData;
  } catch (error) {
    console.error('Error storing trip request in Redis:', error);
    throw error;
  }
};

/**
 * Get trip requests within a radius of a location
 * @param {number} longitude - Driver's longitude
 * @param {number} latitude - Driver's latitude
 * @param {number} [radiusInKm=5] - Radius in kilometers
 * @param {number} [limit=20] - Maximum number of results
 * @returns {Promise<Array>} - List of trip requests
 */
export const getTripRequestsNearby = async (
  longitude,
  latitude,
  radiusInKm = 5,
  limit = 20,
) => {
  try {
    const client = await getRedisClient();
    const redis = client.connection.client;

    // Get trip request IDs within radius
    const geoResults = await redis.georadius(
      `${TRIP_REQUESTS_PREFIX}:geo`,
      longitude,
      latitude,
      radiusInKm,
      'km',
      'WITHDIST',
      'ASC',
      'COUNT',
      limit,
    );

    // No results
    if (!geoResults || geoResults.length === 0) {
      return [];
    }

    // Fetch all trip requests by ID
    const tripRequestsData = await Promise.all(
      geoResults.map(async ([id]) => {
        const result = await client.get({
          id: `${TRIP_REQUESTS_PREFIX}:${id}`,
          segment: 'tripRequests',
        });
        return result ? result.item : null;
      }),
    );

    // Parse and add distance information
    return tripRequestsData
      .map((data, index) => {
        if (!data) return null;

        const tripRequest = JSON.parse(data);
        const [, distance] = geoResults[index];

        return {
          ...tripRequest,
          distance: parseFloat(distance), // Distance in km from driver
        };
      })
      .filter(Boolean); // Remove null entries
  } catch (error) {
    console.error('Error fetching trip requests from Redis:', error);
    return [];
  }
};

/**
 * Get a specific trip request by ID
 * @param {string} tripRequestId - Trip request ID
 * @returns {Promise<Object|null>} - Trip request data or null if not found
 */
export const getTripRequestById = async (tripRequestId) => {
  try {
    const client = await getRedisClient();
    const key = `${TRIP_REQUESTS_PREFIX}:${tripRequestId}`;

    const result = await client.get({ id: key, segment: 'tripRequests' });
    const data = result ? result.item : null;

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching trip request from Redis:', error);
    return null;
  }
};

/**
 * Delete a trip request (e.g., when it's accepted or expired)
 * @param {string} tripRequestId - Trip request ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTripRequest = async (tripRequestId) => {
  try {
    const client = await getRedisClient();
    const redis = client.connection.client;
    const key = `${TRIP_REQUESTS_PREFIX}:${tripRequestId}`;

    // Remove from geospatial index
    await redis.zrem(`${TRIP_REQUESTS_PREFIX}:geo`, tripRequestId);

    // Delete the main record
    await client.drop({ id: key, segment: 'tripRequests' });

    return true;
  } catch (error) {
    console.error('Error deleting trip request from Redis:', error);
    return false;
  }
};
