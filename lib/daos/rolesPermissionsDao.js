import { models } from '@models';

const attributes = ['id', 'name'];

export const getRoleByName = async (name) => {
  const role = await models.roles.findOne({
    attributes,
    where: { name },
  });
  return role;
};

export const getPermissionsByRoleId = async (roleId) => {
  const permissions = await models.rolePermissions.findAll({
    attributes,
    where: { roleId },
    include: [
      {
        model: models.permissions,
        attributes: ['id', 'name'],
      },
    ],
  });
  return permissions;
};
