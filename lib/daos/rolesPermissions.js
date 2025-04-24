import { models } from '@models';

const attributes = ['id', 'name'];

export const getAllRoles = async () => {
  const roles = await models.roles.findAll({
    attributes,
  });
  return roles;
};

export const getRoleByName = async (name) => {
  const role = await models.roles.findOne({
    attributes,
    where: { name },
  });
  return role;
};

export const getRoleById = async (id) => {
  const role = await models.roles.findOne({
    attributes,
    where: { id },
  });
  return role;
};
