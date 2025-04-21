const { models } = require('@models');

const vehicleTypeAttributes = ['id', 'name', 'createdAt', 'updatedAt'];

export const createVehicleType = async (vehicleTypeProps, options = {}) => {
  const vehicleType = await models.vehicleTypes.create(
    { ...vehicleTypeProps },
    options,
  );
  return vehicleType;
};

export const updateVehicleType = async (vehicleTypeProps, options = {}) => {
  const vehicleType = await models.vehicleTypes.update(vehicleTypeProps, {
    where: { id: vehicleTypeProps.id },
    ...options,
  });
  return { vehicleType };
};

export const findAllVehicleTypes = async (page, limit) => {
  const vehicleTypes = await models.vehicleTypes.findAll({
    attributes: vehicleTypeAttributes,
    offset: (page - 1) * limit,
    limit,
  });
  return vehicleTypes;
};

export const deleteVehicleType = async (vehicleTypeId) => {
  const vehicleType = await models.vehicleTypes.destroy({
    where: { id: vehicleTypeId },
  });
  return vehicleType;
};
