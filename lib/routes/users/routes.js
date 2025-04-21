import { createUser, findAllUser } from '@daos/userDao';
import { server } from '@root/server.js';
import { badImplementation, notFound } from '@utils/responseInterceptors';
import { transformDbArrayResponseToRawResponse } from '@utils/transformerUtils';
import {
  emailAllowedSchema,
  numberSchema,
  stringSchema,
} from '@utils/validationUtils';
import Joi from 'joi';
import get from 'lodash/get';

export default [
  {
    method: 'GET',
    path: '/{userId}',
    options: {
      description: 'get one user by ID',
      notes: 'GET users API',
      tags: ['api', 'users'],
      cors: true,
    },
    handler: async (request) => {
      const { userId } = request.params;
      return server.methods.findOneUser(userId).then((user) => {
        if (!user) {
          return notFound(`No user was found for id ${userId}`);
        }
        return user;
      });
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      const { page, limit } = request.query;
      return findAllUser(page, limit)
        .then((users) => {
          if (get(users.allUsers, 'length')) {
            const { totalCount } = users;
            const allUsers = transformDbArrayResponseToRawResponse(
              users.allUsers,
            ).map((user) => user);

            return h.response({
              results: allUsers,
              totalCount,
            });
          }
          return notFound('No users found');
        })
        .catch((error) => badImplementation(error.message));
    },
    options: {
      description: 'get all users',
      notes: 'GET users API',
      tags: ['api', 'users'],
      plugins: {
        pagination: {
          enabled: true,
        },
        query: {
          pagination: true,
        },
      },
    },
  },
  {
    method: 'POST',
    path: '/createUser',
    handler: async (request) => {
      const { roleId, name, password, email, oauthClientId } = request.payload;
      try {
        const user = await createUser(
          { roleId, name, password, email, oauthClientId },
          {},
        );
        return user;
      } catch (error) {
        return badImplementation(error.message);
      }
    },
    options: {
      description: 'create a new user',
      notes: 'POST users API',
      tags: ['api', 'users'],
      cors: true,
      validate: {
        payload: Joi.object({
          roleId: stringSchema,
          name: stringSchema,
          password: stringSchema,
          email: emailAllowedSchema.required(),
          oauthClientId: numberSchema.required(),
        }),
      },
    },
  },
];
