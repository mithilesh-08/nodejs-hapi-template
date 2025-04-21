import { models } from '@models';

const attributes = [
  'id',
  'role_id',
  'name',
  'password',
  'email',
  'oauth_client_id',
];

export const findOneUser = async (userId) =>
  models.users.findOne({
    attributes,
    where: {
      id: userId,
    },
    underscoredAll: false,
  });

export const findAllUser = async (page, limit) => {
  const where = {};
  const totalCount = await models.users.count({ where });
  const allUsers = await models.users.findAll({
    attributes,
    where,
    offset: (page - 1) * limit,
    limit,
  });
  return { allUsers, totalCount };
};

export const createUser = async (userProps, options = {}) => {
  try {
    const user = await models.users.create(
      {
        ...userProps,
      },
      options,
    );
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUser = async (userProps, options = {}) => {
  const user = await models.users.update(userProps, {
    where: { id: userProps.id },
    ...options,
  });
  return user;
};
