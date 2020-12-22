const faker = require('faker');
const { escape } = require('lodash');
const { ObjectId } = require('mongoose').Types;

const { encrypt } = require('@/src/utils/crypt');
const { Thread, Reply, Board } = require('@/src/models');
const appConfig = require('@/src/config.json');
// const Logger = require('../../../src/config/logger');
const setupTestDB = require('../../utils/setupTestDB');

setupTestDB();

describe('Thread Model', () => {
  let newThread;
  let board;

  beforeEach(() => {
    board = new Board({
      name: faker.lorem.words(1),
      desc: 'pruebas',
    });
    newThread = {
      board,
      ip: encrypt(faker.internet.ip()),
      timestamp: Date.now() / 1000,
      password: 'asd123dsa',
    };
  });

  describe('Thread Validation', () => {
    test('should correctly validate a valid Thread', async () => {
      await expect(new Thread(newThread).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if thread property is set', async () => {
      newThread.thread = ObjectId();
      await expect(new Thread(newThread).validate()).rejects.toThrow();
    });

    test('should throw a validation error if subject length is greater than config max chars', async () => {
      const lotsofwords = faker.lorem.words(appConfig.posting.title.maxChars);
      newThread.title = lotsofwords;
      await expect(new Thread(newThread).validate()).rejects.toThrow();
    });
  });

  describe('Thread to JSON', () => {
    test('should not return ip when toJSON is called', () => {
      const thread = new Thread(newThread).toJSON();
      expect(thread).toBeDefined();
      expect(thread.ip).toEqual(newThread.ip.content);
    });

    test('should not return thread (property) when toJSON is called', () => {
      expect(new Thread(newThread).toJSON()).not.toHaveProperty('thread');
    });
  });

  describe('Thread transform', () => {
    test('should unescape title when transform is called', async () => {
      let isUnescaped = false;
      const unescapedStr = '</tag>';
      newThread.title = escape(unescapedStr);
      const thread = await new Thread(newThread).transform();
      isUnescaped = unescapedStr.localeCompare(thread.title) === 0;
      expect(isUnescaped).toBeTruthy();
    });
  });

  describe('Thread replies', () => {
    test('getReplies() should return a list of replies', async () => {
      const thread = await Thread.create(newThread);
      const replies = [
        await Reply.create({
          board: board.id,
          thread: thread.id,
          ip: encrypt(faker.internet.ip()),
          message: faker.lorem.paragraph(),
          timestamp: Date.now() / 1000,
        }),
        await Reply.create({
          board: board.id,
          thread: thread.id,
          message: faker.lorem.paragraph(),
          ip: encrypt(faker.internet.ip()),
          timestamp: Date.now() / 1000,
        }),
      ];
      await expect(thread.getReplies()).resolves.toStrictEqual(replies.map(reply => reply.transform()));
    });
  });
});
