const faker = require('faker');

const { Ban } = require('@/src/models');
const banTimes = require('@/src/config/banTimes');
const { replyOne } = require('../../fixtures/post.fixture');

describe('Ban Model', () => {
  describe('Ban validations', () => {
    let ip;
    let newBan;

    beforeEach(() => {
      ip = faker.internet.ip();
      newBan = {
        ip,
        post: replyOne._id,
        reason: 'Shitposting',
        until: banTimes.fiveteenMinutes(),
      };
    });

    test('should correctly validate a valid Ban', async () => {
      await expect(new Ban(newBan).validate()).resolves.toBeUndefined();
    });

    test('should throw Error if ip is invalid', async () => {
      newBan.ip = 'invalid';
      await expect(new Ban(newBan).validate()).rejects.toThrow();
    });

    test('should throw Error if post is invalid', async () => {
      newBan.post = 'invalid';
      await expect(new Ban(newBan).validate()).rejects.toThrow();
    });

    test('should throw Error if reason is invalid', async () => {
      newBan.reason = 'invalid';
      await expect(new Ban(newBan).validate()).rejects.toThrow();
    });

    test('should throw Error if until is invalid', async () => {
      newBan.until = 'invalid';
      await expect(new Ban(newBan).validate()).rejects.toThrow();
    });
  });
});
