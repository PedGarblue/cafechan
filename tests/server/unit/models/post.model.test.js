const faker = require('faker');
const { ObjectId } = require('mongoose').Types;

const { encrypt } = require('../../../../src/utils/crypt');
const { Post } = require('../../../../src/models');
const appConfig = require('../../../../src/config.json');
const setupTestDB = require('../../utils/setupTestDB');
const postFixtures = require('../../fixtures/post.fixture');
const boardFixtures = require('../../fixtures/board.fixture');
// const Logger = require('../../../src/config/logger');

setupTestDB();

describe('Post model', () => {
  describe('Post validation', () => {
    let newPost;
    beforeEach(() => {
      newPost = {
        board: boardFixtures.boardOne._id,
        thread: postFixtures.threadOne._id,
        ip: encrypt(faker.internet.ip()),
        timestamp: Date.now() / 1000,
      };
    });

    test('should correctly validate a valid Post', async () => {
      await expect(new Post(newPost).validate()).resolves.toBeUndefined();
    });
    // Board validations
    test('should throw a validation error if Board is not an ObjectId type', async () => {
      /* 
        Strings greater than 12 characters are considered as a BSON ObjectId
        like 'invalidBoard'.
      */
      newPost.board = 'Invalid';
      await expect(new Post(newPost).validate()).rejects.toThrow();
    });
    // Thread validations
    test('should throw a validation error if Thread is not an MongoID', async () => {
      newPost.thread = 'invalid';
      await expect(new Post(newPost).validate()).rejects.toThrow();
    });
    // Postername validations
    test('should throw a validation error if name is empty string', async () => {
      newPost.name = '';
      await expect(new Post(newPost).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name length is greater than config max chars', async () => {
      const lotsofwords = faker.lorem.words(appConfig.posting.name.maxChars);
      newPost.name = lotsofwords;
      await expect(new Post(newPost).validate()).rejects.toThrow();
    });
    // Post message valiations
    test('should throw a validation error if message length is greater than config max chars', async () => {
      const lotsofwords = faker.lorem.words(appConfig.posting.message.maxChars);
      newPost.message = lotsofwords;
      await expect(new Post(newPost).validate()).rejects.toThrow();
    });
  });

  describe('Post toJSON()', () => {
    const newPost = {
      board: ObjectId(),
      thread: ObjectId(),
      ip: encrypt(faker.internet.ip()),
      timestamp: Date.now() / 1000,
    };

    test('should not return post password when toJSON is called', () => {
      expect(new Post(newPost).toJSON()).not.toHaveProperty('password');
    });

    test('should not return ip when toJSON is called', () => {
      expect(new Post(newPost).toJSON()).not.toHaveProperty('ip');
    });
  });
});
