import { resetAndMockDB } from '@utils/testUtils';
import { mockData } from '@utils/mockData';

describe('user daos', () => {
  const { MOCK_USER: mockUser } = mockData;
  const attributes = [
    'id',
    'role_id',
    'name',
    'password',
    'email',
    'oauth_client_id',
  ];

  describe('findOneUser', () => {
    it('should find a user by ID', async () => {
      const { findOneUser } = require('@daos/userDao');
      const testUser = await findOneUser(1);
      expect(testUser.id).toEqual(1);
      expect(testUser.name).toEqual(mockUser.name);
      expect(testUser.email).toEqual(mockUser.email);
      expect(testUser.roleId).toEqual(mockUser.roleId);
      expect(testUser.password).toEqual(mockUser.password);
      expect(testUser.oauthClientId).toEqual(mockUser.oauthClientId);
    });
    it('should call findOne with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'findOne');
      });
      const { findOneUser } = require('@daos/userDao');

      let userId = 1;
      await findOneUser(userId);
      expect(spy).toBeCalledWith({
        attributes,
        underscoredAll: false,
        where: {
          id: userId,
        },
      });

      jest.clearAllMocks();
      userId = 2;
      await findOneUser(userId);
      expect(spy).toBeCalledWith({
        attributes,
        underscoredAll: false,
        where: {
          id: userId,
        },
      });
    });
  });

  describe('findAllUser ', () => {
    let spy;
    const where = {};
    let page = 1;
    let limit = 10;
    let offset = (page - 1) * limit;

    it('should find all the users', async () => {
      const { findAllUser } = require('@daos/userDao');
      const { allUsers } = await findAllUser(1, 10);
      const firstUser = allUsers[0];
      expect(firstUser.id).toEqual(1);
      expect(firstUser.firstName).toEqual(mockUser.firstName);
      expect(firstUser.lastName).toEqual(mockUser.lastName);
      expect(firstUser.email).toEqual(mockUser.email);
    });

    it('should call findAll with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'findAll');
      });
      const { findAllUser } = require('@daos/userDao');
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({
        attributes,
        where,
        offset,
        limit,
      });
      jest.clearAllMocks();
      page = 2;
      limit = 10;
      offset = (page - 1) * limit;
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({
        attributes,
        where,
        offset,
        limit,
      });
    });
    it('should call count with an empty object', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'count');
      });
      const { findAllUser } = require('@daos/userDao');
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({ where });
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      let createSpy;
      await resetAndMockDB((db) => {
        // Create a simple mock implementation that returns a fixed object
        createSpy = jest
          .spyOn(db.models.users, 'create')
          .mockImplementation(() =>
            Promise.resolve({
              id: 1,
              roleId: 1,
              name: 'Test User',
              password: 'pass@123',
              email: 'test@example.com',
              oauthClientId: 1,
            }),
          );
      });

      const { createUser } = require('@daos/userDao');
      const roleId = 1;
      const name = 'Test User';
      const password = 'pass@123';
      const email = 'test@example.com';
      const oauthClientId = 1;

      const user = await createUser({
        roleId,
        name,
        password,
        email,
        oauthClientId,
      });

      // Verify the user was created with correct data
      expect(createSpy).toHaveBeenCalledWith(
        {
          roleId,
          name,
          password,
          email,
          oauthClientId,
        },
        {},
      );

      // Verify the returned user has the expected properties
      expect(user.id).toEqual(1);
      expect(user.name).toEqual(name);
      expect(user.email).toEqual(email);
      expect(user.roleId).toEqual(roleId);
      expect(user.password).toEqual(password);
      expect(user.oauthClientId).toEqual(oauthClientId);
    });
  });

  describe('updateUser', () => {
    it('should update a user with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'update').mockResolvedValue([1]);
      });
      const { updateUser } = require('@daos/userDao');
      const userProps = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
        roleId: 2,
        oauthClientId: 2,
      };

      await updateUser(userProps);

      // Verify the user was updated with correct data
      expect(spy).toHaveBeenCalledWith(userProps, {
        where: { id: userProps.id },
      });
    });
  });
});
