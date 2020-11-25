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
const { insertThreads, threadOne, threadTwo } = require('../../fixtures/post.fixture');
const { Thread, Ban } = require('../../../../src/models');
const appConfig = require('../../../../src/config/appConfig');

setupTestDB();
setupTestCache();

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
