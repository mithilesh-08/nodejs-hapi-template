import { findAllPricingConfigs } from '@daos/pricingConfigDao';

export default async function calculateDistanceAndFare(pickup, dropoff) {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert coordinates from MySQL Point objects
  const lat1 = pickup.latitude;
  const lon1 = pickup.longitude;
  const lat2 = dropoff.latitude;
  const lon2 = dropoff.longitude;

  // Convert latitude and longitude to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Number((R * c).toFixed(2));

  const pricingConfig = await findAllPricingConfigs(1, 1);

  // Check if pricing configuration exists
  if (!pricingConfig || pricingConfig.length === 0) {
    throw new Error('No pricing configuration found');
  }
  // Convert values to integers to avoid type discrepancies
  const baseFare = parseInt(pricingConfig[0].baseFare, 10);
  const perKmRate = parseInt(pricingConfig[0].perKmRate, 10);

  const fare = Number((baseFare + perKmRate * distance).toFixed(2));
  return {
    distance,
    fare,
  };
}
