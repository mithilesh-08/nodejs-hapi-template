import { models } from '@models';

const attributes = [
  'id',
  'role_id',
  'name',
  'password',
  'email',
  'oauth_client_id',
];

export const findOneUser = async (userId, options = {}) =>
  models.users.findOne({
    attributes,
    where: {
      id: userId,
    },
    underscoredAll: false,
    ...options,
  });

/**
 * Find a user by email with optional includes
 * @param {string} email - User's email
 * @param {Object} options - Additional query options (include, etc.)
 * @returns {Promise<Object>} - User object if found
 */
export const findUserByEmail = async (email, options = {}) =>
  models.users.findOne({
    where: { email },
    ...options,
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
  const user = await models.users.create(
    {
      ...userProps,
    },
    options,
  );
  return user;
};

export const updateUser = async (userProps, options = {}) => {
  const user = await models.users.update(userProps, {
    where: { id: userProps.id },
    ...options,
  });
  return user;
};
