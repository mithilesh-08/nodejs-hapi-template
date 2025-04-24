import { resetAndMockDB } from '@utils/testUtils';

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
    let spy;
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    it('should find all pricing configs', async () => {
      const { findAllPricingConfigs } = require('@daos/pricingConfigDao');

      await resetAndMockDB((db) => {
        jest.spyOn(db.models.pricingConfigs, 'findAll').mockImplementation(() =>
          Promise.resolve([
            {
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
            },
          ]),
        );
      });

      const pricingConfigs = await findAllPricingConfigs(page, limit);
      const firstConfig = pricingConfigs[0];

      expect(firstConfig.id).toEqual(1);
      expect(firstConfig.baseFare).toEqual(5.0);
      expect(firstConfig.perKmRate).toEqual(2.0);
    });

    it('should call findAll with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.pricingConfigs, 'findAll');
      });

      const { findAllPricingConfigs } = require('@daos/pricingConfigDao');
      await findAllPricingConfigs(page, limit);

      expect(spy).toBeCalledWith({
        offset,
        limit,
      });

      jest.clearAllMocks();
      const newPage = 2;
      const newLimit = 15;
      const newOffset = (newPage - 1) * newLimit;

      await findAllPricingConfigs(newPage, newLimit);
      expect(spy).toBeCalledWith({
        offset: newOffset,
        limit: newLimit,
      });
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
