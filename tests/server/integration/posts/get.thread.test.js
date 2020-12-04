const request = require('supertest');
const httpStatus = require('http-status');
const mcache = require('memory-cache');
const app = require('../../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const setupTestCache = require('../../utils/setupTestCache');
const { createBoard } = require('../../fixtures/board.fixture');
const { createThread, insertReplies, replyOne, replyTwo } = require('../../fixtures/post.fixture');
const appConfig = require('../../../../src/config/appConfig');

setupTestDB();
setupTestCache();

describe('GET /:board/thread/:threadid/', () => {
  test('should return 200 if thread is valid and return it as JSON', async () => {
    const board = await createBoard();
    const thread = await createThread();

    const res = await request(app)
      .get(`/${board.name}/thread/${thread.seq_id}/`)
      .set('Accept', 'application/json')
      .send()
      .expect(httpStatus.OK);

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
    expect(res.body).toHaveProperty('thread');
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
