import { resetAndMockDB } from '@utils/testUtils';
import { mockData } from '@utils/mockData';

const { MOCK_USER: user } = mockData;

describe('/user route tests ', () => {
  let server;
  beforeEach(async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
    });
  });
  it('should return 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/1',
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/2',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.result.message).toEqual('No user was found for id 2');
  });

  it('should return all the users ', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });

    expect(res.statusCode).toEqual(200);
    const userOne = res.result.results[0];
    expect(userOne.id).toEqual(user.id);
    expect(userOne.first_name).toEqual(user.firstName);
    expect(userOne.last_name).toEqual(user.lastName);
    expect(userOne.email).toEqual(user.email);
    expect(userOne.oauth_client_id).toEqual(user.oauth_client_id);
    expect(res.result.total_count).toEqual(1);
  });

  it('should return notFound if no users are found', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
      allDbs.models.users.findAll = () => null;
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return badImplementation if findAllUsers fails', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
      // eslint-disable-next-line no-param-reassign
      allDbs.models.users.findAll = () =>
        new Promise((resolve, reject) => {
          reject(new Error());
        });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toEqual(500);
  });
});

describe('register route tests ', () => {
  let server;
  beforeEach(async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
      // Mock the getRoleByName function
      allDbs.models.roles = {
        findOne: (query) => {
          // Return null for 'UNKNOWN' user type to simulate role not found
          if (query.where && query.where.name === 'UNKNOWN') {
            return Promise.resolve(null);
          }
          return Promise.resolve({ id: 1, name: 'RIDER' });
        },
      };

      // Mock the findOneOauthClient function
      allDbs.models.oauthClients = {
        findOne: () => Promise.resolve({ id: 1, clientId: 'TEST_CLIENT_ID_0' }),
      };

      // Mock the createUser function to return success
      allDbs.models.users.create = () =>
        Promise.resolve({
          id: 'mocked-uuid',
          name: user.name,
          email: user.email,
          password: user.password,
          roleId: 1,
          oauthClientId: 1,
          get: () => ({
            id: 'mocked-uuid',
            name: user.name,
            email: user.email,
          }),
        });
    });
  });

  it('should validate the request payload', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/register',
      payload: {
        name: user.name,
        // email: user.email,
        password: user.password,
        userType: user.userType,
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/register',
      payload: {
        name: user.name,
        // missing required fields email and oauthClientId
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should register a new user', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/register',
      payload: {
        name: user.name,
        email: user.email,
        password: user.password,
        userType: 'RIDER',
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 when user type is not found', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/register',
      payload: {
        name: user.name,
        email: user.email,
        password: user.password,
        userType: 'UNKNOWN',
      },
    });
    expect(res.statusCode).toEqual(404);
  });
});

describe('login route tests ', () => {
  let server;
  beforeEach(async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });

      // Mock findUserByEmail to return a user
      allDbs.models.users.findOne = (query) => {
        if (query.where && query.where.email === user.email) {
          return Promise.resolve({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            oauthClientId: user.oauth_client_id,
          });
        }
        return Promise.resolve(null);
      };

      // Mock createAccessToken to throw an error
      allDbs.models.oauthAccessTokens = {
        create: () => Promise.reject(new Error('Test error')),
      };

      // Mock the oauthClients.findOne to return a valid client object
      allDbs.models.oauthClients = {
        findOne: () =>
          Promise.resolve({
            id: 1,
            oauth_client_resources: [{ get: () => ({ id: 1 }) }],
            oauth_client_scope: { get: () => ({ id: 1, scope: 'USER' }) },
          }),
      };
    });
  });

  it('should validate the request payload', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 404 when invalid credentials are provided', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'nonexistent@example.com',
        password: 'password',
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return 200 when valid credentials are provided', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      // Mock findUserByEmail to return a user for this specific test
      allDbs.models.users.findOne = (query) => {
        if (query.where && query.where.email === user.email) {
          return Promise.resolve({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            oauthClientId: user.oauth_client_id,
          });
        }
        return Promise.resolve(null);
      };

      // Mock createAccessToken to return a token for this specific test
      allDbs.models.oauthAccessTokens.create = () =>
        Promise.resolve({
          accessToken: 'test-token',
          expiresIn: 3600,
          get: () => ({
            accessToken: 'test-token',
            expiresIn: 3600,
          }),
        });

      // Mock getMetaDataByOAuthClientId to return metadata
      allDbs.models.oauthClients.findOne = () =>
        Promise.resolve({
          id: 1,
          oauth_client_resources: [{ get: () => ({ id: 1 }) }],
          oauth_client_scope: { get: () => ({ id: 1, scope: 'USER' }) },
        });
    });

    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: user.email,
        password: user.password,
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 when user is not found', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'nonexistent@example.com',
        password: 'password',
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return 500 when there is an error', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: user.email,
        password: user.password,
      },
    });
    expect(res.statusCode).toEqual(500);
  });
});
