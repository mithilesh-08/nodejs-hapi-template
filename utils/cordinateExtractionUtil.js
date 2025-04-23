export default function extractCoordinate(location, index) {
  if (!location) return 0;

  if (typeof location.coordinates === 'function') {
    return location.coordinates()[index];
  }

  return location.coordinates?.[index] || 0;
}
