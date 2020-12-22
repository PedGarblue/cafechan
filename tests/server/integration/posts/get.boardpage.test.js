const request = require('supertest');
const httpStatus = require('http-status');
const mcache = require('memory-cache');

const app = require('@/src/app');
const appConfig = require('@/src/config/appConfig');
const setupTestDB = require('../../utils/setupTestDB');
const setupTestCache = require('../../utils/setupTestCache');
const { createBoard } = require('../../fixtures/board.fixture');
const { insertThreads, threadOne, threadTwo } = require('../../fixtures/post.fixture');

setupTestDB();
setupTestCache();

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
    expect(res.body.board).toEqual({
      __v: expect.anything(),
      _id: expect.anything(),
      id: expect.anything(),
      allowed_filetypes: ['PNG', 'JPG'],
      allowedfiletypes: ['image/png', 'image/jpeg'],
      anonymous: 'Anonymous',
      forcedanon: true,
      locked: false,
      max_file_size: '10 MB',
      maxfilesize: 1024 * 1024 * 10,
      maxpages: 7,
      maxreplies: 200,
      nsfw: false,
      postsperpage: 5,
      screened: false,
      section: 'ocio',
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
