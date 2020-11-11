const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');
const app = require('../../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { banOne, banTwo, insertBans, createBan } = require('../fixtures/ban.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { admin, userOne, insertUsers } = require('../fixtures/user.fixture');
const banTimes = require('../../../src/config/banTimes');
const { Ban } = require('../../../src/models');

setupTestDB();

describe('Bans routes', () => {
  describe('GET /ban/', () => {
    test('should return 200 and a list of bans', async () => {
      await insertBans([banOne, banTwo]);
      await insertUsers([admin]);

      const res = await request(app)
        .get('/ban/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toEqual({
        ip: banOne.ip,
        post: banOne.post.toHexString(),
        reason: banOne.reason,
        until: banOne.until,
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
      });
    });

    test('should return 401 if the access token is missing', async () => {
      await request(app)
        .get('/ban/')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if the user is not authorized', async () => {
      await insertUsers([userOne]);
      await request(app)
        .get('/ban/')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('POST /ban/', () => {
    let newBan;

    beforeEach(() => {
      newBan = {
        ip: faker.internet.ip(),
        until: banTimes.day(),
        reason: 'Shitposting',
      };
    });

    test('should return 201 and create ban', async () => {
      await insertUsers([admin]);
      const res = await request(app)
        .post('/ban/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBan)
        .expect(httpStatus.CREATED);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toEqual({
        ip: newBan.ip,
        reason: newBan.reason,
        until: newBan.until,
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
      });

      const banDb = await Ban.findById(res.body._id);

      expect(banDb).toBeDefined();
      expect(banDb.ip).toEqual(newBan.ip);
      expect(banDb.reason).toEqual(newBan.reason);
      expect(banDb.until).toEqual(newBan.until);
    });

    test('should return 401 if access token is missing', async () => {
      await request(app)
        .post('/ban/')
        .send(newBan)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if the user is not authorized', async () => {
      await insertUsers([userOne]);
      await request(app)
        .post('/ban/')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newBan)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE /ban/:banid', () => {
    test('should return 200 and delete ban', async () => {
      await insertUsers([admin]);
      const ban = await createBan();
      await request(app)
        .delete(`/ban/${ban.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const banDb = await Ban.findById(ban.id);
      expect(banDb).toBeNull();
    });

    test('should return 401 if access token is missing', async () => {
      await request(app)
        .delete(`/ban/${banOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if the user is not authorized', async () => {
      await insertUsers([userOne]);
      await request(app)
        .delete(`/ban/${banOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if the ban is not found', async () => {
      await insertUsers([admin]);
      await request(app)
        .delete(`/ban/${banOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
