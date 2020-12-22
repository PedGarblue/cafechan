const faker = require('faker');
const httpMocks = require('node-mocks-http');
const PostValidate = require('@/src/middlewares/postingValidation');
const PostParsing = require('@/src/middlewares/postingParse');
const { Post } = require('@/src/models');
const { threadOne, replyOne } = require('../../fixtures/post.fixture');
const { boardOne } = require('../../fixtures/board.fixture');
const setupTestDb = require('../../utils/setupTestDB');

setupTestDb();

const FIRST_CALL = 0;
const FIRST_ARG = 0;

describe('Post Validation Middleware', () => {
  describe('Reply validation', () => {
    let reply;

    beforeEach(() => {
      reply = {
        board: boardOne._id.toHexString(),
        thread: threadOne._id.toHexString(),
        message: faker.lorem.paragraph(),
      };
    });

    test('should pass correctly if data is ok', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      req.body = reply;

      await PostValidate.reply(req, res, next);
    });

    test('should throw error if reply is duplicated', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jest.spyOn(Post, 'find').mockResolvedValue([reply]);
      req.body = reply;

      await expect(PostValidate.reply(req, res, next)).resolves.toBeUndefined();
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[FIRST_CALL][FIRST_ARG].message).toMatch('Oops, tu post parece flood o está duplicado');
    });

    test('should throw error if reply is not in post ratio', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      replyOne.timestamp = Date.now();
      jest.spyOn(Post, 'find').mockResolvedValue([replyOne]);
      req.body = reply;

      await expect(PostValidate.reply(req, res, next)).resolves.toBeUndefined();
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[FIRST_CALL][FIRST_ARG].message).toMatch('Oops, hay muchos posts en cola');
    });
  });

  describe('Thread validation', () => {
    let thread;

    beforeEach(() => {
      thread = {
        board: boardOne._id.toHexString(),
        title: faker.lorem.words(10),
        message: faker.lorem.paragraph(),
      };
    });

    test('should resolve correctly if data is ok', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      req.body = thread;

      await expect(PostValidate.thread(req, res, next)).resolves.toBeUndefined();
    });

    test('should throw error if thread is not in post ratio', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      threadOne.timestamp = Date.now();
      jest.spyOn(Post, 'find').mockResolvedValue([threadOne]);
      req.body = thread;

      await expect(PostValidate.thread(req, res, next)).resolves.toBeUndefined();
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[FIRST_CALL][FIRST_ARG].message).toMatch('Oops, hay muchos posts en cola');
    });

    test('should throw error if thread is duplicated', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jest.spyOn(Post, 'find').mockResolvedValue([thread]);
      req.body = thread;

      await expect(PostValidate.thread(req, res, next)).resolves.toBeUndefined();
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[FIRST_CALL][FIRST_ARG].message).toMatch('Oops, tu post parece flood o está duplicado');
    });
  });
});

describe('Post Parsing middleware', () => {
  let post;

  beforeEach(() => {
    post = {
      title: faker.lorem.words(5),
      message: faker.lorem.paragraph(),
    };
  });

  test('should add <span> with green text color to every line that stars with ">"', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    post.message = '>test';
    req.body = post;

    await expect(PostParsing(req, res, next)).resolves.toBeUndefined();
    expect(req.body.message).toMatch('<span class="greentext">>test</span>');
  });

  test('should add <span> with red text color to every line that stars with "<"', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    post.message = '<test';
    req.body = post;

    await expect(PostParsing(req, res, next)).resolves.toBeUndefined();
    expect(req.body.message).toMatch('<span class="redtext">&lt;test</span>');
  });
});
