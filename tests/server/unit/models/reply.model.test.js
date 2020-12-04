const faker = require('faker');
const { omit } = require('lodash');

const { encrypt } = require('../../../../src/utils/crypt');
const { Reply, Board } = require('../../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const boardFixture = require('../../fixtures/board.fixture');
const postFixture = require('../../fixtures/post.fixture');
/* 
  const appConfig = require('../../../src/config.json');
  const Logger = require('../../../src/config/logger');
*/

setupTestDB();

describe('Reply Model', () => {
  let newReply;
  // eslint-disable-next-line no-unused-vars
  let board;

  beforeEach(() => {
    board = new Board({
      name: faker.lorem.words(1),
      desc: 'pruebas',
    });
    newReply = {
      board: boardFixture.boardOne._id,
      thread: postFixture.threadOne._id,
      ip: encrypt(faker.internet.ip()),
      timestamp: Date.now() / 1000,
    };
  });

  describe('Reply Validation', () => {
    test('should correctly validate a valid Reply', async () => {
      await expect(new Reply(newReply).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if thread is not set', async () => {
      newReply = omit(newReply, ['thread']);
      await expect(new Reply(newReply).validate()).rejects.toThrow();
    });
  });

  describe('Reply to JSON', () => {
    test('should not return post password when toJSON is called', () => {
      expect(new Reply(newReply).toJSON()).not.toHaveProperty('password');
    });

    test('should return ip hash when toJSON is called', () => {
      const reply = new Reply(newReply).toJSON();
      expect(reply).toBeDefined();
      expect(reply.ip).toEqual(newReply.ip.content);
    });
  });
});
