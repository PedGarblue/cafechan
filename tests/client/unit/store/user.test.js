import request from '@/app/request';
import userStore from '@/app/store/modules/user';

const faker = require('faker');

const { USER_REQUEST, USER_SUCCESS, USER_ERROR, USER_LOGOUT } = require('@/app/store/actions/user');
const { AUTH_LOGOUT } = require('@/app/store/actions/auth');
const { storeFixture } = require('../../fixtures/store.fixture');

jest.mock('@/app/request');
Storage.prototype.setItem = jest.fn();
Storage.prototype.removeItem = jest.fn();

describe('User Global Store', () => {
  afterEach(() => {
    Storage.prototype.setItem.mockClear();
    Storage.prototype.removeItem.mockClear();
    request.mockClear();
  });

  describe('Actions', () => {
    let stateModules;
    let user;

    beforeEach(() => {
      stateModules = storeFixture;
      user = {
        id: faker.random.number(),
        name: faker.internet.userName(),
      };
      request.mockResolvedValue(user);
    });

    afterEach(() => {
      stateModules.commit.mockClear();
      stateModules.dispatch.mockClear();
    });

    describe('USER_REQUEST', () => {
      test('should make user data request succesfully and commits USER_SUCCESS', async () => {
        await expect(userStore.actions[USER_REQUEST](stateModules, { id: user.id })).resolves.toEqual(user);
        expect(request.mock.calls[0][0]).toMatchObject({
          url: `/api/user/${user.id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${stateModules.state.tokens.access.token}`,
          },
        });
        expect(stateModules.commit).nthCalledWith(1, USER_REQUEST);
        expect(stateModules.commit).nthCalledWith(2, USER_SUCCESS, user);
      });

      test('should save in LocalStorage the user id and save the full user in SessionStorage', async () => {
        await userStore.actions[USER_REQUEST](stateModules, { id: user.id });
        expect(Storage.prototype.setItem.mock.calls).toHaveLength(2);
        expect(Storage.prototype.setItem.mock.calls[0]).toEqual(['user', user.id]);
        expect(Storage.prototype.setItem.mock.calls[1]).toEqual(['user', JSON.stringify(user)]);
      });

      test('should commit USER_LOGOUT, USER_ERROR and dispatch AUTH_LOGOUT if user request fails', async () => {
        request.mockRejectedValue(new Error('some error'));
        await expect(userStore.actions[USER_REQUEST](stateModules, { id: user.id })).rejects.toThrow();
        expect(stateModules.commit).nthCalledWith(2, USER_LOGOUT);
        expect(stateModules.commit).nthCalledWith(3, USER_ERROR);
        expect(stateModules.dispatch).toBeCalledWith(AUTH_LOGOUT);
      });
    });

    describe('USER_LOGOUT', () => {
      test('should delete all user data', () => {
        userStore.actions[USER_LOGOUT](stateModules);
        expect(Storage.prototype.removeItem.mock.calls[0]).toEqual(['user']);
        expect(Storage.prototype.removeItem.mock.calls[1]).toEqual(['user']);
        expect(stateModules.commit).toBeCalledWith(USER_LOGOUT);
      });
    });
  });
});
