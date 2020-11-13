import request from '../../../../app/request';

const faker = require('faker');
const banTimes = require('../../../../src/config/banTimes');
const { banOne, banTwo } = require('../../fixtures/ban.fixture');
const { adminAccessToken } = require('../../fixtures/token.fixture');
const { getBans, sendBan, deleteBan } = require('../../../../app/requests/ban');

jest.mock('../../../../app/request');

describe('Bans Requests', () => {
  afterEach(() => {
    request.mockReset();
  });

  describe('getBans()', () => {
    beforeEach(() => {
      request.mockResolvedValue([banOne, banTwo]);
    });

    test('should return a list of bans', async () => {
      const bans = await getBans(adminAccessToken);

      expect(request.mock.calls.length).toBe(1);
      expect(bans).toBeDefined();
      expect(bans).toHaveLength(2);
      expect(bans[0]).toEqual(banOne);
    });

    test('should throw error if access token is not set', () => {
      expect(() => getBans()).toThrow('Access token is not set');
    });
  });

  describe('sendBan()', () => {
    let newBan;

    beforeEach(() => {
      newBan = {
        ip: faker.internet.ip(),
        reason: 'Shitposting',
        until: banTimes.hour(),
      };

      request.mockResolvedValue(newBan);
    });

    test('should send ban if data is ok', async () => {
      const ban = await sendBan(adminAccessToken, newBan);
      const requestOptions = request.mock.calls[0][0];
      expect(requestOptions).toMatchObject({
        url: '/ban/',
        method: 'POST',
        data: newBan,
      });
      expect(ban).toEqual(newBan);
    });

    test('should throw error if access token is not set', () => {
      expect(() => sendBan(newBan)).toThrow('Access token is not set');
    });

    test('should throw error if ban is not set', () => {
      expect(() => sendBan(adminAccessToken)).toThrow('Ban is not set');
    });
  });

  describe('deleteBan()', () => {
    let ban;

    beforeEach(() => {
      ban = {
        id: banOne._id,
      };

      request.mockResolvedValue(undefined);
    });

    test('should send delete ban request correctly', async () => {
      await expect(deleteBan(adminAccessToken, ban)).resolves.toBeUndefined();
      const requestOptions = request.mock.calls[0][0];
      expect(requestOptions).toMatchObject({
        url: `/ban/${ban.id}`,
        method: 'DELETE',
      });
    });

    test('should throw error if access token is not set', () => {
      expect(() => deleteBan(ban)).toThrow('Access token is not set');
    });

    test('should throw error if ban is not set', () => {
      expect(() => deleteBan(adminAccessToken)).toThrow('Ban is not set');
    });
  });
});
