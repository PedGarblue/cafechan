import { getPosts, removePost, getThread, sendPost } from '@/app/requests/post';
import request from '@/app/request';
import { replyOne, threadOne, threadTwo } from '../../fixtures/posts.fixtures';
import { boardOne } from '../../fixtures/board.fixture';
import { adminAccessToken } from '../../fixtures/token.fixture';

jest.mock('@/app/request');

describe('Posts Requests', () => {
  describe('getPosts()', () => {
    beforeEach(() => {
      // eslint-disable-next-line global-require
      request.mockResolvedValue([threadOne, threadTwo, replyOne]);
    });

    afterEach(() => {
      request.mockClear();
    });

    test('should make get posts request and resolve a list of posts', async () => {
      const posts = await getPosts(adminAccessToken);

      expect(request).toBeCalled();
      expect(posts).toBeDefined();
      expect(posts).toBeInstanceOf(Array);
      expect(posts).toHaveLength(3);
      expect(posts[0]).toBe(threadOne);
    });

    test('should throw a Error if accessToken is not set', async () => {
      await expect(() => getPosts()).rejects.toThrow('Access token is not set');
    });
  });

  describe('removePost()', () => {
    afterEach(() => {
      request.mockClear();
    });

    test('should make delete post request correctly', async () => {
      const post = {
        id: replyOne.id,
      };
      await expect(removePost(adminAccessToken, post)).resolves.toBeUndefined();
    });

    test('should throw Error if access token is not set', async () => {
      await expect(() => removePost(adminAccessToken)).rejects.toThrow('Post is not set');
    });
  });

  describe('getThread()', () => {
    beforeEach(() => {
      request.mockImplementation(() => {
        return new Promise(resolve => {
          resolve({ thread: threadOne });
        });
      });
    });

    afterEach(() => {
      request.mockClear();
    });

    test('should request succesfully the thread', async () => {
      await expect(getThread(boardOne.name, threadOne.seq_id)).resolves.toBe(threadOne);
      expect(request).toBeCalledWith(
        {
          url: `/${boardOne.name}/thread/${threadOne.seq_id}/`,
          method: 'GET',
        },
        { 'Content-Type': 'application/json' }
      );
    });

    test('should reject if boardname is not set', async () => {
      await expect(getThread(undefined, threadOne.seq_id)).rejects.toThrow('Boardname is not set');
    });

    test('should reject if boardid is not set', async () => {
      await expect(getThread(boardOne.name, undefined)).rejects.toThrow('Thread is not set');
    });
  });

  describe('sendPost()', () => {
    test('should throw Error if boardid is not a String', async () => {
      expect(() => sendPost()).toThrow('Invalid argument');
    });

    describe('thread()', () => {
      beforeEach(() => {
        request.mockImplementation(() => {
          return new Promise(resolve => {
            resolve(threadOne);
          });
        });
      });

      afterEach(() => {
        request.mockClear();
      });

      test('should make send post request correctly and return the thread posted if data is ok', async () => {
        await expect(sendPost(boardOne._id).thread({ title: threadOne.title, message: threadOne.message })).resolves.toBe(
          threadOne
        );
        const options = request.mock.calls[0][0];
        expect(options.url).toMatch('/api/posts/thread');
        expect(options.method).toBe('POST');
        // eslint-disable-next-line no-undef
        expect(options.data).toBeInstanceOf(FormData);
        expect(options.data.get('board')).toBe(threadOne.board);
        expect(options.data.get('title')).toBe(threadOne.title);
        expect(options.data.get('message')).toBe(threadOne.message);
      });
      test('should throw Error if message is not set', async () => {
        await expect(() => sendPost(boardOne.name, boardOne._id).thread({ title: threadOne.title })).rejects.toThrow(
          'To post a thread in this board you need a message'
        );
      });
    });

    describe('reply()', () => {
      beforeEach(() => {
        request.mockImplementation(() => {
          return new Promise(resolve => {
            resolve(replyOne);
          });
        });
      });

      afterEach(() => {
        request.mockClear();
      });

      test('should make send post request correctly and return the reply posted if data is ok', async () => {
        await expect(sendPost(replyOne.board).reply(threadOne._id, { message: replyOne.message })).resolves.toBe(replyOne);
        const options = request.mock.calls[0][0];
        expect(options.url).toMatch('/api/posts/reply');
        expect(options.method).toBe('POST');
        // eslint-disable-next-line no-undef
        expect(options.data).toBeInstanceOf(FormData);
        expect(options.data.get('board')).toBe(replyOne.board);
        expect(options.data.get('thread')).toBe(threadOne._id);
        expect(options.data.get('message')).toBe(replyOne.message);
      });

      test('should throw Error if message is not set', async () => {
        await expect(() => sendPost(boardOne._id).reply(threadOne._id, {})).rejects.toThrow(
          'To reply this thread you need a message'
        );
      });
    });
  });
});
