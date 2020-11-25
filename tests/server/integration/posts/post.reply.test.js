const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const mcache = require('memory-cache');
const app = require('../../../../src/app');
const banTimes = require('../../../../src/config/banTimes');
const setupTestDB = require('../../utils/setupTestDB');
const setupTestCache = require('../../utils/setupTestCache');
const { createBoard } = require('../../fixtures/board.fixture');
const { createThread, insertReplies, replyOne } = require('../../fixtures/post.fixture');
const { Reply, Ban } = require('../../../../src/models');
const appConfig = require('../../../../src/config/appConfig');

setupTestCache();
setupTestDB();

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
