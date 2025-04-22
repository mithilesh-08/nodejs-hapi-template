import { createAccessToken } from '@daos/oauthAccessTokensDao';
import { findOneOauthClient } from '@daos/oauthClientsDao';
import { getRoleByName } from '@daos/rolesPermissionsDao';
import { createUser, findAllUser, findUserByEmail } from '@daos/userDao';
import { server } from '@root/server.js';
import { badImplementation, notFound } from '@utils/responseInterceptors';
import { transformDbArrayResponseToRawResponse } from '@utils/transformerUtils';
import { emailAllowedSchema, stringSchema } from '@utils/validationUtils';
import Joi from 'joi';
import get from 'lodash/get';
import { v4 as uuidv4 } from 'uuid';

// import bcrypt from 'bcrypt';

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
    path: '/register',
    options: {
      description: 'register a new rider / driver',
      notes: 'POST riders / drivers registration API',
      tags: ['api', 'riders', 'drivers'],
      auth: false,
      validate: {
        payload: Joi.object({
          name: stringSchema.required(),
          email: emailAllowedSchema.required(),
          password: stringSchema.required(),
          userType: stringSchema.required(),
        }),
      },
    },
    handler: async (request) => {
      try {
        const { name, email, password, userType } = request.payload;

        // Find the RIDER role
        const role = await getRoleByName(userType);
        if (!role) {
          return notFound(`${userType} role not found`);
        }

        // Find a client with USER scope
        const client = await findOneOauthClient(
          'CLIENT_CREDENTIALS',
          'TEST_CLIENT_ID_0', // Using the seeded client with USER scope
          'TEST_CLIENT_SECRET',
        );

        if (!client) {
          return notFound('Unable to find appropriate OAuth client');
        }

        // Create the rider
        const user = await createUser({
          id: uuidv4(),
          name,
          email,
          // password: bcrypt.hashSync(password, 10),
          password,
          roleId: role.id,
          oauthClientId: client.id,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          message:
            userType === 'RIDER'
              ? 'Rider registered successfully'
              : 'Driver registered successfully',
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      description: 'Login as a rider / driver',
      notes: 'POST riders / drivers login API',
      tags: ['api', 'riders', 'drivers'],
      auth: false,
      validate: {
        payload: Joi.object({
          email: emailAllowedSchema.required(),
          password: stringSchema.required(),
        }),
      },
    },
    handler: async (request) => {
      try {
        const { email, password } = request.payload;

        // Find user with matching email
        const user = await findUserByEmail(email);

        // if (!user || !bcrypt.compareSync(password, user.password)) {
        //   return badRequest(`Invalid ${userType} email or password`);
        // }
        if (!user || user.password !== password) {
          return notFound('Invalid email or password');
        }

        // Create an access token for the user
        const token = await createAccessToken(user.oauthClientId);

        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          accessToken: token.accessToken,
          expiresIn: token.expiresIn,
        };
      } catch (error) {
        return badImplementation(error.message);
      }
    },
  },
];
