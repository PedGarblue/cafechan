const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const mcache = require('memory-cache');
const app = require('../../../src/app');
const banTimes = require('../../../src/config/banTimes');
const setupTestDB = require('../utils/setupTestDB');
const setupTestCache = require('../utils/setupTestCache');
const { createBoard } = require('../fixtures/board.fixture');
// const Logger = require('../../src/config/logger');
const {
  createThread,
  insertThreads,
  threadOne,
  threadTwo,
  insertReplies,
  replyOne,
  replyTwo,
} = require('../fixtures/post.fixture');
const { Thread, Reply, Ban } = require('../../../src/models');
const appConfig = require('../../../src/config/appConfig');

setupTestDB();
setupTestCache();

describe('Posting Routes', () => {
  /*
    THREAD POSTING
  */
  describe('POST /:board/', () => {
    let newThread;

    beforeEach(() => {
      newThread = {
        title: faker.lorem.words(4),
        message: faker.lorem.paragraph(),
      };
    });

    test('should return 201 and successfully create a new thread with json format', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });

      const res = await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(newThread)
        .expect(httpStatus.CREATED);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('ip');
      expect(res.body).toMatchObject({
        title: newThread.title,
        message: newThread.message,
      });
      const thread = await Thread.findById(res.body.id);
      expect(thread).toBeDefined();
      expect(thread).toMatchObject({
        name: board.anonymous,
        title: newThread.title,
        message: newThread.message,
      });
    });

    test('should return 201 and successfully create a new thread and clear board cache', async () => {
      const board = await createBoard();
      await insertThreads([threadOne, threadTwo]);

      newThread = Object.assign(newThread, { board: board.id });
      mcache.put(`__express__/${board.name}/`, 'some content');

      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(newThread)
        .expect(httpStatus.CREATED);

      expect(mcache.get(`__express__/${board.name}/`)).toBeNull();
    }, 25000);

    test('should return 302 and successfully create a new thread', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });

      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'text/html')
        .send(newThread)
        .expect(httpStatus.FOUND);

      const thread = await Thread.findOne(omit(newThread, ['board']));
      expect(thread).toBeDefined();
      expect(thread).toMatchObject({
        name: board.anonymous,
        title: newThread.title,
        message: newThread.message,
      });
    });

    test('should return 400 error if the poster ip is banned', async () => {
      const bannedIp = faker.internet.ip();
      const board = await createBoard();
      await Ban.create({
        ip: bannedIp,
        reason: 'Shitposting',
        until: banTimes.year(),
      });

      newThread = Object.assign(newThread, { board: board.id });

      await request(app)
        .post(`/${board.name}/`)
        .set('X-Forwarded-For', bannedIp)
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);

      const threadDb = await Thread.findOne(newThread);
      expect(threadDb).toBeNull();
    });

    test('should return 400 error if board is not set', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });

      newThread = omit(newThread, ['board']);

      await request(app)
        .post(`/${board.name}/`)
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if title is not set', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });

      newThread = omit(newThread, ['title']);

      await request(app)
        .post(`/${board.name}/`)
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if title is too long', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });
      newThread.title = faker.lorem.words(appConfig.posting.title.maxChars);

      await request(app)
        .post(`/${board.name}/`)
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if message is too long', async () => {
      const board = await createBoard();
      newThread = Object.assign(newThread, { board: board.id });
      newThread.message = faker.lorem.words(appConfig.posting.message.maxChars);

      await request(app)
        .post(`/${board.name}/`)
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if thread send is out of posting ratio', async () => {
      const board = await createBoard();
      threadOne.timestamp = Date.now();
      await insertThreads([threadOne]);
      newThread = Object.assign(newThread, { board: board.id });
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(newThread)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if thread send is duplicated', async () => {
      const board = await createBoard();
      const toDuplicate = Object.assign(newThread, { board: board.id, timestamp: Date.now() - 1000 });
      const duplicated = newThread;
      duplicated.board = board.id;
      await insertThreads([toDuplicate]);
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(duplicated)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  /*
    BOARDPAGE VIEW
  */
  describe('GET /:board/', () => {
    test('should return 200 if board is valid and return it as JSON', async () => {
      const board = await createBoard();

      const res = await request(app)
        .get(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('board');
      expect(res.body.board).toMatchObject({
        name: board.name,
        desc: board.desc,
      });
      expect(res.body).toHaveProperty('sections');
      expect(res.body.sections).toBeInstanceOf(Array);
      expect(res.body.sections).toHaveLength(appConfig.boards.sections.length);
      expect(res.body.sections[1]).toMatchObject({
        name: 'ocio',
        boards: [
          {
            name: board.name,
            desc: board.desc,
          },
        ],
      });
      expect(res.body).toHaveProperty('page');
      expect(res.body.page).toHaveProperty('key');
      expect(res.body.page).toHaveProperty('actual');
      expect(res.body.page).toHaveProperty('totalpages');
    });

    test('should return 404 if board is not found', async () => {
      await createBoard();
      await request(app)
        .get(`/bad/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 200 with one page of threads', async () => {
      const board = await createBoard();

      await insertThreads([threadOne, threadTwo]);

      const res = await request(app)
        .get(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('board');
      expect(res.body).toHaveProperty('threads');
      expect(res.body.threads).toBeInstanceOf(Array);
      expect(res.body.threads).toHaveLength(2);
      expect(res.body.threads[0]).toMatchObject({
        board: threadTwo.board.toHexString(),
        title: threadTwo.title,
        message: threadTwo.message,
      });
    });

    test('should return 302 on redundant request of first page', async () => {
      const board = await createBoard();

      await insertThreads([threadOne, threadTwo]);

      await request(app)
        .get(`/${board.name}/1`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.MOVED_PERMANENTLY);
    });

    test('should return 200 and cache in memory the requested board', async () => {
      const board = await createBoard();

      await insertThreads([threadOne]);

      const res = await request(app)
        .get(`/${board.name}/`)
        .set('Accept', 'text/html')
        .send()
        .expect(httpStatus.OK);

      expect(mcache.get(`__express__/${board.name}/`)).toEqual(res.text);
    }, 30000);
  });

  /*
    REPLY POSTING
  */
  describe('POST /:board/thread/:threadid/', () => {
    let newReply;

    beforeEach(() => {
      newReply = {
        message: faker.lorem.paragraph(),
      };
    });

    test('should return 201 and sucessfully return a reply with json format', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      const res = await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'application/json')
        .send(newReply)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('ip');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toMatchObject({
        message: newReply.message,
      });

      let replydb = await Reply.findById(res.body.id);
      expect(replydb).toBeDefined();
      replydb = replydb.transform();
      expect(replydb.kind).toBe('Reply');
      expect(replydb.board.toHexString()).toBe(res.body.board.id);
      expect(replydb.timestamp).toBe(res.body.timestamp);
      expect(replydb.message).toBe(res.body.message);
    });

    test('should return 201 and clear board and thread cache', async () => {
      const board = await createBoard();
      const thread = await createThread();

      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });

      const resBoard = await request(app)
        .get(`/${board.name}/`)
        .set('Accept', 'text/html')
        .send()
        .expect(httpStatus.OK);

      expect(mcache.get(`__express__/${board.name}/`)).toBe(resBoard.text);

      const resThread = await request(app)
        .get(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'text/html')
        .send()
        .expect(httpStatus.OK);

      expect(mcache.get(`__express__/${board.name}/thread/${thread.seq_id}/`)).toBe(resThread.text);

      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'application/json')
        .send(newReply)
        .expect(httpStatus.CREATED);

      expect(mcache.get(`__express__/${board.name}/`)).toBeNull();
      expect(mcache.get(`/${board.name}/thread/${thread.seq_id}/`)).toBeNull();
    });

    test('should return 302 and sucessfully redirect to boardpage', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'text/html')
        .send(newReply)
        .expect(httpStatus.FOUND);

      let replydb = await Reply.findOne(omit(newReply, ['board', 'thread']));
      expect(replydb).toBeDefined();
      replydb = replydb.transform();
      expect(replydb.kind).toBe('Reply');
      expect(replydb.board.toHexString()).toBe(board.id);
      expect(replydb.message).toBe(newReply.message);
    });

    test('should return 400 error if the poster ip is banned', async () => {
      const bannedIp = faker.internet.ip();
      const board = await createBoard();
      const thread = await createThread();
      await Ban.create({
        ip: bannedIp,
        reason: 'Shitposting',
        until: banTimes.year(),
      });
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .set('X-Forwarded-For', bannedIp)
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);

      const replyDb = await Reply.findOne(newReply);
      expect(replyDb).toBeNull();
    });

    test('should return 400 if board is not set', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { thread: thread.id });
      newReply.message = '';
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if thread is not set', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { board: board.id });
      newReply.message = '';
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if message is not set', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      newReply.message = '';
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if message is too long', async () => {
      const board = await createBoard();
      const thread = await createThread();
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      newReply.message = faker.lorem.words(appConfig.posting.message.maxChars);
      await request(app)
        .post(`/${board.name}/thread/${thread.seq_id}/`)
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if reply send is out of posting ratio', async () => {
      const board = await createBoard();
      const thread = await createThread();
      replyOne.timestamp = Date.now() - 18000;
      await insertReplies([replyOne]);
      newReply = Object.assign(newReply, { board: board.id, thread: thread.id });
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if reply send is duplicated', async () => {
      const board = await createBoard();
      const thread = await createThread();
      replyOne.timestamp = Date.now() - 18000;
      await insertReplies([replyOne]);
      newReply = Object.assign(replyOne, { board: board.id, thread: thread.id });
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .send(newReply)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  /*
    THREAD VIEW
  */
  describe('GET /:board/thread/:threadid/', () => {
    test('should return 200 if thread is valid and return it as JSON', async () => {
      const board = await createBoard();
      const thread = await createThread();

      const res = await request(app)
        .get(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('thread');
      expect(res.body.thread).not.toHaveProperty('ip');
      expect(res.body.thread).not.toHaveProperty('password');
      expect(res.body.thread).toHaveProperty('replies');
      expect(res.body.thread.replies).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty('sections');
      expect(res.body.sections).toBeInstanceOf(Array);
      expect(res.body.sections).toHaveLength(appConfig.boards.sections.length);
      expect(res.body.sections[1]).toMatchObject({
        name: 'ocio',
        boards: [
          {
            name: board.name,
            desc: board.desc,
          },
        ],
      });
      expect(res.body).toHaveProperty('page');
      expect(res.body.page).toHaveProperty('key');
    });

    test('should return 200 and save in memory the requested thread', async () => {
      const board = await createBoard();
      const thread = await createThread();

      const res = await request(app)
        .get(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'text/html')
        .send()
        .expect(httpStatus.OK);

      expect(mcache.get(`__express__/${board.name}/thread/${thread.seq_id}/`)).toEqual(res.text);
    });

    test('should return 404 if thread is not found', async () => {
      const board = await createBoard();
      await request(app)
        .get(`/${board.name}/thread/77777/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 200 with a valid thread and replies', async () => {
      const board = await createBoard();
      const thread = await createThread();
      await insertReplies([replyOne, replyTwo]);

      const res = await request(app)
        .get(`/${board.name}/thread/${thread.seq_id}/`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('board');
      expect(res.body).toHaveProperty('thread');
      expect(res.body.thread).toHaveProperty('replies');
      expect(res.body.thread.replies).toBeInstanceOf(Array);
      expect(res.body.thread.replies).toHaveLength(2);
      expect(res.body.thread.replies[0]).toMatchObject({
        message: replyOne.message,
      });
    });
  });
});
