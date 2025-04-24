import { resetAndMockDB } from '@utils/testUtils';

const vehicleTypeAttributes = ['id', 'name', 'createdAt', 'updatedAt'];

describe('vehicleType daos', () => {
  describe('createVehicleType', () => {
    it('should call create with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.vehicleTypes, 'create')
          .mockImplementation(() =>
            Promise.resolve({
              id: 1,
              name: 'Test Vehicle Type',
            }),
          );
      });
      const { createVehicleType } = require('@daos/vehicleTypeDao');
      const name = 'Test Vehicle Type';
      const vehicleType = await createVehicleType({ name });
      expect(spy).toHaveBeenCalledWith({ name }, {});
      expect(vehicleType.id).toEqual(1);
      expect(vehicleType.name).toEqual(name);
    });
  });

  describe('updateVehicleType', () => {
    it('should call update with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.vehicleTypes, 'update')
          .mockImplementation(() => Promise.resolve([1]));
      });
      const { updateVehicleType } = require('@daos/vehicleTypeDao');
      const name = 'Updated Vehicle Type';
      await updateVehicleType({ name, id: 1 });
      expect(spy).toHaveBeenCalledWith(
        { name, id: 1 },
        {
          where: { id: 1 },
        },
      );
    });
  });

  describe('findAllVehicleTypes', () => {
    it('should call findAll with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.vehicleTypes, 'findAll');

        // Mock the first call to return one result
        spy.mockImplementationOnce(() => [
          {
            id: 1,
            name: 'Test Vehicle Type',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

        // Mock the second call to return additional results
        spy.mockImplementationOnce(() => [
          {
            id: 1,
            name: 'Test Vehicle Type',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'Second Vehicle Type',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });

      const { findAllVehicleTypes } = require('@daos/vehicleTypeDao');
      const page = 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      // First call
      let vehicleTypes = await findAllVehicleTypes(page, limit);
      const firstVehicleType = vehicleTypes[0];

      // Check the call parameters for first call
      expect(spy).toHaveBeenNthCalledWith(1, {
        offset,
        limit,
        attributes: vehicleTypeAttributes,
      });

      // Check the first result
      expect(firstVehicleType.id).toEqual(1);
      expect(firstVehicleType.name).toEqual('Test Vehicle Type');
      expect(firstVehicleType.createdAt).toEqual(new Date());
      expect(firstVehicleType.updatedAt).toEqual(new Date());

      // Second call
      vehicleTypes = await findAllVehicleTypes(page, limit);

      // Check the call parameters for second call
      expect(spy).toHaveBeenNthCalledWith(2, {
        offset,
        limit,
        attributes: vehicleTypeAttributes,
      });

      // Check the second result
      expect(vehicleTypes[0].id).toEqual(1);
      expect(vehicleTypes[0].name).toEqual('Test Vehicle Type');
      expect(vehicleTypes[1].id).toEqual(2);
      expect(vehicleTypes[1].name).toEqual('Second Vehicle Type');
    });
  });

  it('delete vehicle type', async () => {
    let spy;
    await resetAndMockDB((db) => {
      spy = jest.spyOn(db.models.vehicleTypes, 'destroy');
    });
    const { deleteVehicleType } = require('@daos/vehicleTypeDao');
    await deleteVehicleType(1);
    expect(spy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
