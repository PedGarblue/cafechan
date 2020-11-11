const request = require('supertest');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const app = require('../../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { admin, userOne, insertUsers } = require('../fixtures/user.fixture');
const { Thread, Reply, Post } = require('../../../src/models');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { insertThreads, threadOne, threadTwo, insertReplies, replyOne, replyTwo } = require('../fixtures/post.fixture');
const { boardOne, insertBoards } = require('../fixtures/board.fixture');

setupTestDB();

describe('Post Management Routes', () => {
  describe('GET /posts/', () => {
    test('should return 200 and a list all recent posts', async () => {
      await insertUsers([admin]);
      await insertThreads([threadOne, threadTwo]);

      const res = await request(app)
        .get('/posts/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        _id: threadOne._id.toHexString(),
        board: threadOne.board.toHexString(),
        title: threadOne.title,
        message: threadOne.message,
      });
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .get('/posts/')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-authorized user is trying to list recent posts', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/posts/')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertThreads([threadOne, threadTwo]);
      await insertReplies([replyOne, replyTwo]);

      const res = await request(app)
        .get('/posts/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'timestamp:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(4);
      expect(res.body[0]._id).toBe(threadOne._id.toHexString());
    });

    test('should correctly apply filter on kind field', async () => {
      await insertUsers([admin]);
      await insertThreads([threadOne, threadTwo]);
      await insertReplies([replyOne]);

      const res = await request(app)
        .get('/posts/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ kind: 'Thread' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        _id: threadOne._id.toHexString(),
        board: threadOne.board.toHexString(),
        title: threadOne.title,
        message: threadOne.message,
      });
    });

    test('should return 400 if kind field has no valid Post type', async () => {
      await insertUsers([admin]);

      await request(app)
        .get('/posts/')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ kind: 'wrong' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /posts/thread/:threadid', () => {
    test('should return 204 and delete thread if data is ok', async () => {
      const ip = faker.internet.ip();
      threadOne.ip = await bcrypt.hash(ip, 8);
      await insertBoards([boardOne]);
      await insertThreads([threadOne]);

      await request(app)
        .delete(`/posts/thread/${threadOne._id}`)
        .set('X-Forwarded-For', ip)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const threadDb = await Thread.findById(threadOne._id);
      expect(threadDb).toBeDefined();
      expect(threadDb.deleted).toBeTruthy();
    });

    test('should return 204 and delete thread and their replies if data is ok', async () => {
      const ip = faker.internet.ip();
      threadOne.ip = await bcrypt.hash(ip, 8);
      await insertBoards([boardOne]);
      await insertThreads([threadOne]);
      await insertReplies([replyOne, replyTwo]);

      await request(app)
        .delete(`/posts/thread/${threadOne._id}`)
        .set('X-Forwarded-For', ip)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const threadDb = await Thread.findById(threadOne._id);
      expect(threadDb).toBeDefined();
      expect(threadDb.deleted).toBeTruthy();

      const replyOneDb = await Reply.findById(replyOne._id);
      expect(replyOneDb).toBeDefined();
      expect(replyOneDb.deleted).toBeTruthy();
    });

    test('should return 403 if non-OP user is trying to delete the thread', async () => {
      const ip = faker.internet.ip();
      threadOne.ip = await bcrypt.hash(ip, 8);
      await insertThreads([threadOne]);

      await request(app)
        .delete(`/posts/thread/${threadOne._id}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if boardid is not a mongoid string', async () => {
      await request(app)
        .delete(`/posts/thread/invalid`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if thread is not found', async () => {
      await request(app)
        .delete(`/posts/thread/${threadOne._id}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /posts/reply/:replyid', () => {
    test('should return 204 and delete reply if data is ok', async () => {
      const ip = faker.internet.ip();
      replyOne.ip = await bcrypt.hash(ip, 8);
      await insertBoards([boardOne]);
      await insertThreads([threadOne]);
      await insertReplies([replyOne]);

      await request(app)
        .delete(`/posts/reply/${replyOne._id}`)
        .set('X-Forwarded-For', ip)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const replyDb = await Reply.findById(replyOne._id);
      expect(replyDb).toBeDefined();
      expect(replyDb.deleted).toBeTruthy();
    });

    test('should return 403 if is not the reply author', async () => {
      const ip = faker.internet.ip();
      replyOne.ip = await bcrypt.hash(ip, 8);
      await insertThreads([threadOne]);
      await insertReplies([replyOne]);

      await request(app)
        .delete(`/posts/reply/${replyOne._id}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if replyid is not a mongoid string', async () => {
      await request(app)
        .delete(`/posts/reply/invalid`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if reply is not found', async () => {
      await request(app)
        .delete(`/posts/reply/${replyOne._id}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /posts/:postid', () => {
    test('should return 204 and delete Thread if data is ok', async () => {
      await insertBoards([boardOne]);
      await insertUsers([admin]);
      await insertThreads([threadOne]);

      await request(app)
        .delete(`/posts/${threadOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const threadDb = await Post.findById(threadOne._id);
      expect(threadDb).toBeNull();
    });

    test('should return 204 and delete Thread and their replies if data is ok', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);
      await insertThreads([threadOne]);
      await insertReplies([replyOne, replyTwo]);

      await request(app)
        .delete(`/posts/${threadOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const threadDb = await Post.findById(threadOne._id);
      expect(threadDb).toBeNull();

      const replyOneDb = await Post.findById(replyOne._id);
      expect(replyOneDb).toBeNull();
    });

    test('should return 204 and delete Reply if data is ok', async () => {
      await insertUsers([admin]);
      await insertBoards([boardOne]);
      await insertThreads([threadOne]);
      await insertReplies([replyOne]);

      await request(app)
        .delete(`/posts/${replyOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NO_CONTENT);

      const replyDb = await Post.findById(replyOne._id);
      expect(replyDb).toBeNull();
    });

    test('should return 400 if :postid is not a valid MongoId string', async () => {
      await insertUsers([admin]);
      await request(app)
        .delete(`/posts/invalid`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if access token is missing', async () => {
      await request(app)
        .delete(`/posts/${threadOne._id}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non-authorized user is trying to delete a post', async () => {
      await insertUsers([userOne]);
      await insertThreads([threadOne]);

      await request(app)
        .delete(`/posts/${threadOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if post is not found', async () => {
      await insertUsers([admin]);
      await request(app)
        .delete(`/posts/${threadOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Accept', 'application/json')
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
