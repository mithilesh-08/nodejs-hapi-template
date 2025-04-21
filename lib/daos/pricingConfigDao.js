const { models } = require('@models');

const pricingConfigAttributes = [
  'id',
  'baseFare',
  'perKmRate',
  'perMinuteRate',
  'bookingFee',
  'surgeMultiplier',
  'effectiveFrom',
  'effectiveTo',
  'createdAt',
  'updatedAt',
];

export const createPricingConfig = async (pricingConfigProps, options = {}) => {
  const pricingConfig = await models.pricingConfigs.create(
    pricingConfigProps,
    options,
  );
  return pricingConfig;
};

export const updatePricingConfig = async (pricingConfigProps, options = {}) => {
  const pricingConfig = await models.pricingConfigs.update(pricingConfigProps, {
    where: { id: pricingConfigProps.id },
    ...options,
  });
  return pricingConfig;
};

export const findAllPricingConfigs = async (page, limit) => {
  const pricingConfigs = await models.pricingConfigs.findAll({
    attributes: pricingConfigAttributes,
    offset: (page - 1) * limit,
    limit,
  });
  return pricingConfigs;
};

export const deletePricingConfig = async (id) => {
  const pricingConfig = await models.pricingConfigs.destroy({
    where: { id },
  });
  return pricingConfig;
};
