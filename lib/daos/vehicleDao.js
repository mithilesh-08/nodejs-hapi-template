const { models } = require('@models');

const vehicleAttributes = [
  'id',
  'name',
  'vehicleTypeId',
  'driverId',
  'licensePlate',
  'color',
  'year',
  'createdAt',
  'updatedAt',
];

const vehicleInclude = [
  {
    model: models.users,
    as: 'driver',
    attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
  },
  {
    model: models.vehicleTypes,
    as: 'vehicleType',
    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
  },
];

export const createVehicle = async (vehicleProps, options = {}) => {
  const vehicle = await models.vehicles.create({ ...vehicleProps }, options);
  return vehicle;
};

export const updateVehicle = async (vehicleProps, options = {}) => {
  const vehicle = await models.vehicles.update(vehicleProps, {
    where: { id: vehicleProps.id },
    ...options,
  });
  return { vehicle };
};

export const getVehicleById = async (vehicleId) => {
  const vehicle = await models.vehicles.findOne({
    where: { id: vehicleId },
    attributes: vehicleAttributes,
    include: vehicleInclude,
  });
  return vehicle;
};

export const findAllVehiclesByDriverId = async (driverId, page, limit) => {
  const vehicles = await models.vehicles.findAll({
    where: { driverId },
    offset: (page - 1) * limit,
    limit,
    attributes: vehicleAttributes,
    include: vehicleInclude,
  });
  return vehicles;
};

export const deleteVehicle = async (vehicleId) => {
  const vehicle = await models.vehicles.destroy({ where: { id: vehicleId } });
  return vehicle;
};
