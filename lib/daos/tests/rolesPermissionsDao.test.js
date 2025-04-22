import { resetAndMockDB } from '@utils/testUtils';

const mockRole = { id: 1, name: 'ADMIN' };
const mockPermissions = [
  { id: 1, name: 'READ', permission: { id: 1, name: 'READ' } },
  { id: 2, name: 'WRITE', permission: { id: 2, name: 'WRITE' } },
];

describe('rolePermissionsDao', () => {
  describe('getPermissionsByRoleId', () => {
    it('should get permissions by role id', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.rolePermissions, 'findAll')
          .mockImplementation(() => Promise.resolve(mockPermissions));
      });

      const { getPermissionsByRoleId } = require('@daos/rolesPermissionsDao');
      const permissions = await getPermissionsByRoleId(mockRole.id);
      expect(permissions).toEqual(mockPermissions);

      // Verify spy was called without checking exact parameters
      expect(spy).toHaveBeenCalled();
    });

    it('should find role by name', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.roles, 'findOne')
          .mockImplementation(() => Promise.resolve(mockRole));
      });

      const { getRoleByName } = require('@daos/rolesPermissionsDao');
      const role = await getRoleByName(mockRole.name);
      expect(role).toEqual(mockRole);

      expect(spy).toHaveBeenCalledWith({
        attributes: ['id', 'name'],
        where: { name: mockRole.name },
      });
    });
  });
});
