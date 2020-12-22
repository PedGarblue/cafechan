const httpMocks = require('node-mocks-http');
const faker = require('faker');
const ban = require('@/src/middlewares/ban');
const { Ban } = require('@/src/models');
const banTimes = require('@/src/config/banTimes');
const setupTestDb = require('../../utils/setupTestDB');

setupTestDb();

describe('Ban middleware', () => {
  describe('check() middleware', () => {
    let ip;
    let newBan;

    beforeEach(() => {
      ip = faker.internet.ip();
      newBan = {
        ip,
        reason: 'Shitposting',
        until: banTimes.year(),
      };
    });

    test('should pass if the ip is not banned', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      req.ip = ip;

      await expect(ban.check(req, res, next)).resolves.toBeUndefined();
    });

    test('should throw error if the poster ip is banned', async () => {
      const FIRST_CALL = 0;
      const FIRST_ARG = 0;
      await Ban.create(newBan);
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      req.ip = ip;

      await expect(ban.check(req, res, next)).resolves.toBeUndefined();
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[FIRST_CALL][FIRST_ARG].message).toBe('You are banned!');
    }, 10000);
  });
});
