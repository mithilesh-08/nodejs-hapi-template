const { models } = require('@models');

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
  const { count, rows: pricingConfigs } =
    await models.pricingConfigs.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
    });
  return { pricingConfigs, total: count };
};

export const deletePricingConfig = async (id) => {
  const pricingConfig = await models.pricingConfigs.destroy({
    where: { id },
  });
  return pricingConfig;
};
