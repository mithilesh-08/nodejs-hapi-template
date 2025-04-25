import { resetAndMockDB } from '@utils/testUtils';
import { models } from '@models';
import { findAllPricingConfigs } from '@daos/pricingConfigDao';

describe('pricing config daos', () => {
  describe('createPricingConfig', () => {
    it('should create a pricing config', async () => {
      let createSpy;
      await resetAndMockDB((db) => {
        createSpy = jest
          .spyOn(db.models.pricingConfigs, 'create')
          .mockImplementation(() =>
            Promise.resolve({
              id: 1,
              baseFare: 5.0,
              perKmRate: 2.0,
              perMinuteRate: 0.5,
              bookingFee: 1.5,
              surgeMultiplier: 1.0,
              effectiveFrom: new Date('2023-01-01'),
              effectiveTo: new Date('2023-12-31'),
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          );
      });

      const { createPricingConfig } = require('@daos/pricingConfigDao');
      const pricingConfigProps = {
        baseFare: 5.0,
        perKmRate: 2.0,
        perMinuteRate: 0.5,
        bookingFee: 1.5,
        surgeMultiplier: 1.0,
        effectiveFrom: new Date('2023-01-01'),
        effectiveTo: new Date('2023-12-31'),
      };

      const pricingConfig = await createPricingConfig(pricingConfigProps);

      // Verify the pricing config was created with correct data
      expect(createSpy).toHaveBeenCalledWith(pricingConfigProps, {});

      // Verify the returned pricing config has the expected properties
      expect(pricingConfig.id).toEqual(1);
      expect(pricingConfig.baseFare).toEqual(pricingConfigProps.baseFare);
      expect(pricingConfig.perKmRate).toEqual(pricingConfigProps.perKmRate);
      expect(pricingConfig.perMinuteRate).toEqual(
        pricingConfigProps.perMinuteRate,
      );
      expect(pricingConfig.bookingFee).toEqual(pricingConfigProps.bookingFee);
      expect(pricingConfig.surgeMultiplier).toEqual(
        pricingConfigProps.surgeMultiplier,
      );
    });
  });

  describe('updatePricingConfig', () => {
    it('should update a pricing config', async () => {
      let updateSpy;
      await resetAndMockDB((db) => {
        updateSpy = jest
          .spyOn(db.models.pricingConfigs, 'update')
          .mockImplementation(() =>
            Promise.resolve([
              1,
              [
                {
                  id: 1,
                  baseFare: 6.0,
                  perKmRate: 2.5,
                  perMinuteRate: 0.6,
                  bookingFee: 2.0,
                  surgeMultiplier: 1.2,
                  effectiveFrom: new Date('2023-01-01'),
                  effectiveTo: new Date('2023-12-31'),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            ]),
          );
      });

      const { updatePricingConfig } = require('@daos/pricingConfigDao');
      const pricingConfigProps = {
        id: 1,
        baseFare: 6.0,
        perKmRate: 2.5,
        perMinuteRate: 0.6,
        bookingFee: 2.0,
        surgeMultiplier: 1.2,
      };

      await updatePricingConfig(pricingConfigProps);

      // Verify the pricing config was updated with correct data
      expect(updateSpy).toHaveBeenCalledWith(pricingConfigProps, {
        where: { id: pricingConfigProps.id },
      });
    });
  });

  describe('findAllPricingConfigs', () => {
    it('should find all pricing configs', async () => {
      const mockConfigs = [
        {
          id: 1,
          baseFare: 5.0,
          perKmRate: 2.0,
          perMinuteRate: 0.2,
          minimumFare: 7.0,
          currencyCode: 'USD',
          cancellationFee: 5.0,
        },
      ];

      const spy = jest
        .spyOn(models.pricingConfigs, 'findAndCountAll')
        .mockResolvedValue({
          count: mockConfigs.length,
          rows: mockConfigs,
        });

      const { pricingConfigs, total } = await findAllPricingConfigs(1, 10);

      const firstConfig = pricingConfigs[0];

      expect(firstConfig.id).toEqual(1);
      expect(firstConfig.baseFare).toEqual(5.0);
      expect(firstConfig.perKmRate).toEqual(2.0);
      expect(total).toEqual(1);

      spy.mockRestore();
    });

    it('should call findAndCountAll with the correct parameters', async () => {
      const page = 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const spy = jest
        .spyOn(models.pricingConfigs, 'findAndCountAll')
        .mockResolvedValue({
          count: 1,
          rows: [{ id: 1 }],
        });

      await findAllPricingConfigs(page, limit);

      expect(spy).toBeCalledWith({
        offset,
        limit,
      });

      spy.mockRestore();
    });
  });

  describe('deletePricingConfig', () => {
    it('should delete a pricing config', async () => {
      let destroySpy;
      await resetAndMockDB((db) => {
        destroySpy = jest
          .spyOn(db.models.pricingConfigs, 'destroy')
          .mockImplementation(() => Promise.resolve(1));
      });

      const { deletePricingConfig } = require('@daos/pricingConfigDao');
      const id = 1;

      const result = await deletePricingConfig(id);

      // Verify the pricing config was deleted with correct id
      expect(destroySpy).toHaveBeenCalledWith({
        where: { id },
      });

      // Verify the result is as expected (typically the number of rows affected)
      expect(result).toEqual(1);
    });
  });
});
