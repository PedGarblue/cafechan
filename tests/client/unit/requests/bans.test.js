import faker from 'faker';

import banTimes from '@/src/config/banTimes';
import request from '@/app/request';
import { getBans, sendBan, deleteBan } from '@/app/requests/ban';
import { banOne, banTwo } from '../../fixtures/ban.fixture';
import { adminAccessToken } from '../../fixtures/token.fixture';

jest.mock('@/app/request');

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

      expect(request).toBeCalledWith({
        url: '/api/ban/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
      expect(bans).toBeDefined();
      expect(bans).toHaveLength(2);
      expect(bans[0]).toEqual(banOne);
    });

    test('should throw error if access token is not set', async () => {
      await expect(() => getBans()).rejects.toThrow('Access token is not set');
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
      expect(request).toBeCalledWith({
        url: '/api/ban/',
        method: 'POST',
        data: newBan,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
      expect(ban).toEqual(newBan);
    });

    test('should throw error if access token is not set', async () => {
      await expect(() => sendBan(newBan)).rejects.toThrow('Access token is not set');
    });

    test('should throw error if ban is not set', async () => {
      await expect(() => sendBan(adminAccessToken)).rejects.toThrow('Ban is not set');
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
      expect(request).toBeCalledWith({
        url: `/api/ban/${ban.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should throw error if access token is not set', async () => {
      await expect(() => deleteBan(ban)).rejects.toThrow('Access token is not set');
    });

    test('should throw error if ban is not set', async () => {
      await expect(() => deleteBan(adminAccessToken)).rejects.toThrow('Ban is not set');
    });
  });
});
