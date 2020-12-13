const request = require('supertest');
const { omit } = require('lodash');
const httpStatus = require('http-status');
const app = require('../../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { boardOne, boardTwo, insertBoards } = require('../fixtures/board.fixture');
const { admin, userOne, insertUsers } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { Board } = require('../../../src/models');

setupTestDB();

describe('Board management routes', () => {
  describe('POST /board/', () => {
    let newBoard;

    beforeEach(() => {
      newBoard = {
        desc: 'Testing',
        name: 'test',
        section: 'ocio',
        maxfilesize: 20004400,
        allowedfiletypes: ['image/png'],
      };
    });

    test('should return 201 and succesfully create a new board', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/board/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBoard)
        .expect(httpStatus.CREATED);

      const boardDb = await Board.findById(res.body._id);
      expect(boardDb).toBeDefined();
      expect(boardDb.toObject()).toEqual({
        __v: 0,
        _id: expect.anything(),
        name: newBoard.name,
        desc: newBoard.desc,
        section: newBoard.section,
        maxfilesize: newBoard.maxfilesize,
        allowedfiletypes: newBoard.allowedfiletypes,
        anonymous: 'Anonymous',
        forcedanon: true,
        locked: false,
        maxpages: 7,
        maxreplies: 200,
        nsfw: false,
        postsperpage: 5,
        screened: false,
      });
    });

    test('should return 401 if Authorization token is missing', async () => {
      await request(app)
        .post('/board/')
        .send(newBoard)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 402 if user is not admin', async () => {
      await insertUsers([userOne]);

      newBoard = omit(boardOne, ['_id']);

      await request(app)
        .post('/board/')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newBoard)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if name is not set', async () => {
      await insertUsers([admin]);

      newBoard = omit(boardOne, ['_id', 'name']);

      await request(app)
        .post('/board/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBoard)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if desc is not set', async () => {
      await insertUsers([admin]);

      newBoard = omit(boardOne, ['_id', 'desc']);

      await request(app)
        .post('/board/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBoard)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if section is invalid', async () => {
      await insertUsers([admin]);

      newBoard = omit(boardOne, ['_id', 'section']);

      await request(app)
        .post('/board/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBoard)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /board/', () => {
    test('should return 200 and all boards', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne, boardTwo]);

      const res = await request(app)
        .get('/board/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        name: boardOne.name,
        desc: boardOne.desc,
        section: boardOne.section,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertBoards([boardOne, boardTwo]);

      await request(app)
        .get('/board/')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 402 if non-admin user is trying to access all boards', async () => {
      await insertUsers([userOne]);
      await insertBoards([boardOne, boardTwo]);

      await request(app)
        .get('/board/')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /board/:boardid', () => {
    test('should return 200 and board object if data is ok', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      const res = await request(app)
        .get(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toMatchObject({
        _id: boardOne._id.toHexString(),
        name: boardOne.name,
        desc: boardOne.desc,
        section: boardOne.section,
      });
    });

    test('should return 401 if token is missing', async () => {
      await insertBoards([boardOne]);

      await request(app)
        .get(`/board/${boardOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non-authorized user is trying to get a board', async () => {
      await insertUsers([userOne]);
      await insertBoards([boardOne]);

      await request(app)
        .get(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if :boardid is not a monngoId', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      await request(app)
        .get(`/board/wrong`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if board is already not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /board/:boardid', () => {
    let updateBoard;

    beforeEach(() => {
      updateBoard = {
        name: 'tst',
        desc: 'Tests',
        section: 'ocio',
        maxfilesize: 10000000,
        allowedfiletypes: ['image/png', 'image/jpeg'],
      };
    });

    test('should return 200 and successfully update a board as authorized user', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      const res = await request(app)
        .patch(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBoard)
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body).toMatchObject({
        name: updateBoard.name,
        desc: updateBoard.desc,
        section: updateBoard.section,
      });

      const boardDb = await Board.findById(res.body._id);
      expect(boardDb).toBeDefined();
      expect(boardDb).toMatchObject({
        name: updateBoard.name,
        desc: updateBoard.desc,
        section: updateBoard.section,
      });
    });

    test('should return 401 if token is missing', async () => {
      await insertBoards([boardOne]);

      updateBoard.desc = 'Testeos';

      await request(app)
        .patch(`/board/${boardOne._id}`)
        .send(updateBoard)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non-authorized user is trying to update a board', async () => {
      await insertUsers([userOne]);
      await insertBoards([boardOne]);

      updateBoard.desc = 'Testeos';

      await request(app)
        .patch(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBoard)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if board is already not found', async () => {
      await insertUsers([admin]);

      updateBoard.desc = 'Testeos';

      await request(app)
        .patch(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBoard)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if :boardid is not a mongoId', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      updateBoard.desc = 'Testeos';

      await request(app)
        .patch(`/board/wrong`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBoard)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if board has a invalid section', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      updateBoard.section = 'wrong';

      await request(app)
        .patch(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBoard)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /board/:boardid', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);

      await request(app)
        .delete(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbBoard = await Board.findById(boardOne._id);
      expect(dbBoard).toBeNull();
    });

    test('should return 401 if token is missing', async () => {
      await insertBoards([boardOne]);

      await request(app)
        .delete(`/board/${boardOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non-authorized user is trying to delete a board', async () => {
      await insertUsers([userOne]);
      await insertBoards([boardOne]);

      await request(app)
        .delete(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if :boardid is not a mongoId', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/board/wrong`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if board is already not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/board/${boardOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
