const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const mcache = require('memory-cache');
const path = require('path');
const fs = require('fs');

const envConfig = require('../../../../src/config/envConfig');
const app = require('../../../../src/app');
const banTimes = require('../../../../src/config/banTimes');
const setupTestDB = require('../../utils/setupTestDB');
const setupTestCache = require('../../utils/setupTestCache');
const { createBoard } = require('../../fixtures/board.fixture');
const { insertThreads, threadOne, threadTwo } = require('../../fixtures/post.fixture');
const { Thread, Ban } = require('../../../../src/models');
const appConfig = require('../../../../src/config/appConfig');
const { encrypt } = require('../../../../src/utils/crypt');

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
      ip: {
        $init: expect.anything(),
        iv: expect.anything(),
        content: expect.anything(),
      },
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
    const toDuplicate = Object.assign(newThread, { board: board.id, ip: encrypt(faker.internet.ip()), timestamp: Date.now() - 1000 });
    const duplicated = newThread;
    duplicated.board = board.id;
    await insertThreads([toDuplicate]);
    await request(app)
      .post(`/${board.name}/`)
      .set('Accept', 'application/json')
      .send(duplicated)
      .expect(httpStatus.BAD_REQUEST);
  });

  describe('File posting', () => {
    let board;
    const boardsMediaPath = path.join(__dirname, `../../../../public/media`);
    const boardsMediaURL = `${envConfig.site_url}/media`;
    const filePath = `${__dirname}/../../fixtures/images/gondola.jpg`;

    beforeEach(async () => {
      board = await createBoard();
      newThread = {
        title: faker.lorem.words(10),
        message: faker.lorem.paragraph(),
      };
    });

    afterEach(() => {
      fs.rmdirSync(boardsMediaPath, { recursive: true });
    });

    test('should return 201 and sucessfully store the uploaded image correctly', async () => {
      const res = await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .field('board', board.id)
        .field('message', newThread.message)
        .field('title', newThread.title)
        .attach('postfile', filePath)
        .expect(httpStatus.CREATED);

      expect(res.body.file).toBeDefined();
      expect(res.body.file).toEqual({
        mimeType: 'image/jpeg',
        name: 'gondola.jpg',
        size: expect.anything(),
        url: `${boardsMediaURL}/${board.name}/gondola.jpg`,
        thumbnailUrl: `${boardsMediaURL}/${board.name}/thumb_gondola.jpg`,
      });

      const threadDb = await Thread.findById(res.body._id);
      expect(threadDb).toBeDefined();
      expect(threadDb.file).toMatchObject({
        mimeType: 'image/jpeg',
        name: 'gondola.jpg',
        size: expect.anything(),
        thumbnailUrl:
          envConfig.storage_client === 'LOCAL' ? `${boardsMediaURL}/${board.name}/thumb_gondola.jpg` : expect.anything(),
        url: envConfig.storage_client === 'LOCAL' ? `${boardsMediaURL}/${board.name}/gondola.jpg` : expect.anything(),
      });
      if (envConfig.storage_client === 'LOCAL') {
        expect(fs.existsSync(`${boardsMediaPath}/${board.name}/gondola.jpg`)).toBeTruthy();
        expect(fs.existsSync(`${boardsMediaPath}/${board.name}/thumb_gondola.jpg`)).toBeTruthy();
      }
    }, 80000);

    test('should return 400 if file size is greater than board max file size', async () => {
      board.set('maxfilesize', 0);
      await board.save();
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .field('board', board.id)
        .field('message', newThread.message)
        .field('title', newThread.title)
        .attach('postfile', filePath)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if file mime type is not allowed by the board', async () => {
      board.set('allowedfiletypes', []);
      await board.save();
      await request(app)
        .post(`/${board.name}/`)
        .set('Accept', 'application/json')
        .field('board', board.id)
        .field('message', newThread.message)
        .field('title', newThread.title)
        .attach('postfile', filePath)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
