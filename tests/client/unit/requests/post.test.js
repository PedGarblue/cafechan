import { getPosts, removePost, sendPost } from '../../../../app/requests/post';
import { replyOne, threadOne, threadTwo } from '../../fixtures/posts.fixtures';
import { boardOne } from '../../fixtures/board.fixture';
import { adminAccessToken } from '../../fixtures/token.fixture';
import request from '../../../../app/request';

jest.mock('../../../../app/request');

describe('Posts Requests', () => {
  describe('getPosts()', () => {
    beforeEach(() => {
      // eslint-disable-next-line global-require
      request.mockResolvedValue([threadOne, threadTwo, replyOne]);
    });

    test('should make get posts request and resolve a list of posts', async () => {
      const posts = await getPosts(adminAccessToken);

      expect(request.mock.calls.length).toBe(1);
      expect(posts).toBeDefined();
      expect(posts).toBeInstanceOf(Array);
      expect(posts).toHaveLength(3);
      expect(posts[0]).toBe(threadOne);
    });

    test('should throw a Error if accessToken is not set', () => {
      expect(() => getPosts()).toThrow('Access token is not set');
    });
  });

  describe('removePost()', () => {
    test('should make delete post request correctly', async () => {
      const post = {
        id: replyOne.id,
      };
      await expect(removePost(adminAccessToken, post)).resolves.toBeUndefined();
    });
    test('should throw Error if access token is not set', () => {
      expect(() => removePost(adminAccessToken)).toThrow('Post is not set');
    });
  });

  describe('sendPost()', () => {
    test('should throw Error if boardname is a invalid string or undefined', () => {
      const boardid = boardOne._id;
      expect(() => sendPost(boardid)).toThrow('Invalid argument');
    });

    test('should throw Error if boardid is a invalid string or undefined', () => {
      const boardname = boardOne.name;
      expect(() => sendPost(boardname)).toThrow('Invalid argument');
    });

    describe('thread()', () => {
      beforeEach(() => {
        request.mockImplementation(options => {
          const boardURLmatcher = /^\/\w+\/$/gm;
          return new Promise((resolve, reject) => {
            if (!boardURLmatcher.test(options.url)) reject(new Error(`Unexpected URL: ${options.url}`));
            if (options.method !== 'POST') reject(new Error(`Unexpected request method: ${options.method}`));
            if (typeof options.data !== 'object') reject(new Error(`Unexpected data: ${options.data}`));
            if (options.data.board !== boardOne._id) reject(new Error(`Unexpected board: ${options.data.board}`));
            if (options.data.title !== threadOne.title) reject(new Error(`Unexpected title: ${options.data.title}`));
            if (options.data.message !== threadOne.message) reject(new Error(`Unexpected message: ${options.data.board}`));
            resolve(threadOne);
          });
        });
      });

      test('should make send post request correctly and return the thread posted if data is ok', async () => {
        await expect(sendPost(boardOne.name, boardOne._id).thread(threadOne.title, threadOne.message)).resolves.toBe(
          threadOne
        );
      });
      test('should throw Error if message is not set', () => {
        expect(() => sendPost(boardOne.name, boardOne._id).thread(threadOne.title)).toThrow(
          'To post a thread in this board you need a message'
        );
      });
    });

    describe('reply()', () => {
      beforeEach(() => {
        request.mockImplementation(options => {
          const boardURLmatcher = /^\/\w+\/thread\/\d+\/$/gm;
          return new Promise(resolve => {
            expect(boardURLmatcher.test(options.url)).toBeTruthy();
            expect(options.method).toBe('POST');
            expect(options.data).toBeInstanceOf(Object);
            expect(options.data.board).toBe(replyOne.board);
            expect(options.data.thread).toBe(replyOne.thread);
            expect(options.data.message).toBe(replyOne.message);
            resolve(replyOne);
          });
        });
      });

      test('should make send post request correctly and return the reply posted if data is ok', async () => {
        await expect(
          sendPost(boardOne.name, replyOne.board).reply(replyOne.thread, threadOne.seq_id, replyOne.message)
        ).resolves.toBe(replyOne);
      });

      test('should throw Error if message is not set', () => {
        expect(() => sendPost(boardOne.name, boardOne._id).reply(threadOne._id, threadOne.seq_id)).toThrow(
          'To reply this thread you need a message'
        );
      });
    });
  });
});
