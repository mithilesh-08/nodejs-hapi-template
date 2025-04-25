// Import dependencies first
import * as pricingConfigDao from '@daos/pricingConfigDao';
// Import the module under test
import calculateDistanceAndFare from '../tripUtils';

// Mock the dependency directly
jest.mock('@daos/pricingConfigDao');

// Access the mocked function
const mockFindAllPricingConfigs = pricingConfigDao.findAllPricingConfigs;

describe('tripUtils', () => {
  describe('calculateDistanceAndFare', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate correct distance and fare between two points', async () => {
      // Mock pricing configs
      mockFindAllPricingConfigs.mockResolvedValue({
        pricingConfigs: [
          {
            baseFare: '500',
            perKmRate: '100',
          },
        ],
      });

      // Test coordinates - New York and Boston are approximately 306km apart
      const pickup = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const dropoff = {
        latitude: 42.3601,
        longitude: -71.0589,
      };

      const result = await calculateDistanceAndFare(pickup, dropoff);

      // Verify that distance is calculated
      expect(result).toHaveProperty('distance');
      expect(result).toHaveProperty('fare');
      expect(typeof result.distance).toBe('number');
      expect(typeof result.fare).toBe('number');

      // Verify that the fare calculation uses the pricing config correctly
      // Fare = baseFare + (perKmRate * distance)
      const expectedFare = 500 + 100 * result.distance;
      expect(result.fare).toBeCloseTo(expectedFare, 1);

      // Verify that findAllPricingConfigs was called
      expect(mockFindAllPricingConfigs).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error when no pricing configuration is found', async () => {
      // Mock empty pricing configs
      mockFindAllPricingConfigs.mockResolvedValue({
        pricingConfigs: [],
      });

      const pickup = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const dropoff = {
        latitude: 42.3601,
        longitude: -71.0589,
      };

      await expect(calculateDistanceAndFare(pickup, dropoff)).rejects.toThrow(
        'No pricing configuration found',
      );
      expect(mockFindAllPricingConfigs).toHaveBeenCalledWith(1, 1);
    });

    it('should handle null pricing configuration', async () => {
      // Mock null pricing configs
      mockFindAllPricingConfigs.mockResolvedValue({
        pricingConfigs: null,
      });

      const pickup = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const dropoff = {
        latitude: 42.3601,
        longitude: -71.0589,
      };

      await expect(calculateDistanceAndFare(pickup, dropoff)).rejects.toThrow(
        'No pricing configuration found',
      );
      expect(mockFindAllPricingConfigs).toHaveBeenCalledWith(1, 1);
    });

    it('should calculate zero distance when pickup and dropoff are the same', async () => {
      // Mock pricing configs
      mockFindAllPricingConfigs.mockResolvedValue({
        pricingConfigs: [
          {
            baseFare: '500',
            perKmRate: '100',
          },
        ],
      });

      const pickup = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const dropoff = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const result = await calculateDistanceAndFare(pickup, dropoff);

      expect(result.distance).toBe(0);
      // Should be just the base fare
      expect(result.fare).toBe(500);
    });
  });
});
