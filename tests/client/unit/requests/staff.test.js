import request from '@/app/request';

const faker = require('faker');

const { getStaffList, getStaff, createStaff, deleteStaff, editStaff } = require('@/app/requests/staff');
const { admin, userOne, userTwo } = require('../../fixtures/user.fixture');
const { adminAccessToken } = require('../../fixtures/token.fixture');

jest.mock('@/app/request');

describe('Staff requests', () => {
  afterEach(() => {
    request.mockClear();
  });

  describe('getStaffList()', () => {
    beforeEach(() => {
      request.mockResolvedValue([admin, userOne, userTwo]);
    });

    test('should send request and resolve successfully if data is ok', async () => {
      await expect(getStaffList(adminAccessToken)).resolves.toEqual([admin, userOne, userTwo]);
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: '/api/user/?sortBy=role:desc',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(getStaffList()).rejects.toThrow('Access token is not set');
    });
  });

  describe('getStaff()', () => {
    let user;

    beforeEach(() => {
      user = {
        id: userOne._id,
      };
      request.mockResolvedValue(userOne);
    });

    test('should send request and resolve successfully if data is ok', async () => {
      await expect(getStaff(adminAccessToken, user)).resolves.toEqual(userOne);
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: `/api/user/${user.id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(getStaff(null, user)).rejects.toThrow('Access token is not set');
    });
  });

  describe('createStaff()', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      };
      request.mockResolvedValue(newUser);
    });

    test('should send request and resolve successfully if data is ok', async () => {
      await expect(createStaff(adminAccessToken, newUser)).resolves.toEqual(newUser);
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: '/api/user',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(createStaff(null, newUser)).rejects.toThrow('Access token is not set');
    });
  });

  describe('deleteStaff()', () => {
    let user;

    beforeEach(() => {
      user = {
        id: userOne._id,
      };
      request.mockResolvedValue(undefined);
    });

    test('should send request and resolve successfully if data is ok', async () => {
      await expect(deleteStaff(adminAccessToken, user)).resolves.toBeUndefined();
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: `/api/user/${user.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(deleteStaff(null, user)).rejects.toThrow('Access token is not set');
    });
  });

  describe('editStaff()', () => {
    let user;

    beforeEach(() => {
      user = {
        name: faker.internet.userName(),
        role: 'mod',
      };
      request.mockResolvedValue(Object.assign(userOne, user));
    });

    test('should send request and resolve successfully if data is ok', async () => {
      await expect(editStaff(adminAccessToken, user)).resolves.toEqual(Object.assign(userOne, user));
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: `/api/user/${user.id}`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(editStaff(null, user)).rejects.toThrow('Access token is not set');
    });
  });
});
