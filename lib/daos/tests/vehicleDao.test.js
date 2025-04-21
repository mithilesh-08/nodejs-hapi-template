import { resetAndMockDB } from '@utils/testUtils';

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
    model: expect.any(Object),
    as: 'driver',
    attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
  },
  {
    model: expect.any(Object),
    as: 'vehicleType',
    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
  },
];
describe('vehicle daos', () => {
  describe('findOneVehicle', () => {
    it('should call findOne with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.vehicles, 'findOne');
      });
      const { getVehicleById } = require('@daos/vehicleDao');
      const vehicleId = 1;
      await getVehicleById(vehicleId);
      expect(spy).toBeCalledWith({
        where: { id: vehicleId },
        attributes: vehicleAttributes,
        include: vehicleInclude,
      });
    });
  });

  describe('createVehicle', () => {
    it('should call create with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.vehicles, 'create').mockImplementation(() =>
          Promise.resolve({
            id: 1,
            name: 'Test Vehicle',
            vehicleTypeId: 1,
            driverId: 1,
            licensePlate: 'MH12AB1234',
            color: 'RED',
            year: 2020,
          }),
        );
      });
      const { createVehicle } = require('@daos/vehicleDao');
      const name = 'Test Vehicle';
      const vehicleTypeId = 1;
      const driverId = 1;
      const licensePlate = 'MH12AB1234';
      const color = 'RED';
      const year = 2020;
      const vehicle = await createVehicle({
        name,
        vehicleTypeId,
        driverId,
        licensePlate,
        color,
        year,
      });
      expect(spy).toHaveBeenCalledWith(
        { name, vehicleTypeId, driverId, licensePlate, color, year },
        {},
      );
      expect(vehicle.id).toEqual(1);
      expect(vehicle.name).toEqual(name);
      expect(vehicle.vehicleTypeId).toEqual(vehicleTypeId);
      expect(vehicle.driverId).toEqual(driverId);
      expect(vehicle.licensePlate).toEqual(licensePlate);
      expect(vehicle.color).toEqual(color);
      expect(vehicle.year).toEqual(year);
    });
  });

  describe('findAllVehiclesByDriverId', () => {
    it('should call findAll with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.vehicles, 'findAll');

        // Mock the first call to return one result
        spy.mockImplementationOnce(() => [
          {
            id: 1,
            name: 'Test Vehicle',
            vehicleTypeId: 1,
            driverId: 1,
            licensePlate: 'MH12AB1234',
            color: 'RED',
            year: 2020,
          },
        ]);

        // Mock the second call to return a different result
        spy.mockImplementationOnce(() => [
          {
            id: 2,
            name: 'Test Vehicle 2',
            vehicleTypeId: 1,
            driverId: 1,
            licensePlate: 'MH12AB1234',
            color: 'RED',
            year: 2020,
          },
        ]);
      });
      const { findAllVehiclesByDriverId } = require('@daos/vehicleDao');
      const driverId = 1;
      let page = 1;
      let limit = 10;
      let offset = (page - 1) * limit;
      let vehicles = await findAllVehiclesByDriverId(driverId, page, limit);
      const firstVehicle = vehicles[0];

      // Check the call parameters for first call
      expect(spy).toHaveBeenNthCalledWith(1, {
        where: { driverId },
        offset,
        limit,
        attributes: vehicleAttributes,
        include: vehicleInclude,
      });

      // Check the first result
      expect(firstVehicle.id).toEqual(1);
      expect(firstVehicle.name).toEqual('Test Vehicle');
      expect(firstVehicle.vehicleTypeId).toEqual(1);
      expect(firstVehicle.driverId).toEqual(driverId);
      expect(firstVehicle.licensePlate).toEqual('MH12AB1234');
      expect(firstVehicle.color).toEqual('RED');
      expect(firstVehicle.year).toEqual(2020);

      // Second call with different page
      page = 2;
      limit = 10;
      offset = (page - 1) * limit;
      vehicles = await findAllVehiclesByDriverId(driverId, page, limit);
      const secondVehicle = vehicles[0];

      // Check the call parameters for second call
      expect(spy).toHaveBeenNthCalledWith(2, {
        where: { driverId },
        offset,
        limit,
        attributes: vehicleAttributes,
        include: vehicleInclude,
      });

      // Check the second result
      expect(secondVehicle.id).toEqual(2);
      expect(secondVehicle.name).toEqual('Test Vehicle 2');
      expect(secondVehicle.vehicleTypeId).toEqual(1);
      expect(secondVehicle.driverId).toEqual(driverId);
      expect(secondVehicle.licensePlate).toEqual('MH12AB1234');
      expect(secondVehicle.color).toEqual('RED');
      expect(secondVehicle.year).toEqual(2020);
    });
  });

  describe('updateVehicle', () => {
    it('should call update with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.vehicles, 'update')
          .mockImplementation(() => Promise.resolve([1]));
      });
      const { updateVehicle } = require('@daos/vehicleDao');
      const id = 1;
      const name = 'Updated Vehicle';
      const vehicleTypeId = 2;
      const vehicleProps = { id, name, vehicleTypeId };

      await updateVehicle(vehicleProps);

      expect(spy).toHaveBeenCalledWith(vehicleProps, {
        where: { id: vehicleProps.id },
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should call destroy with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.vehicles, 'destroy')
          .mockImplementation(() => Promise.resolve(1));
      });
      const { deleteVehicle } = require('@daos/vehicleDao');
      const vehicleId = 1;

      await deleteVehicle(vehicleId);

      expect(spy).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
    });
  });
});
