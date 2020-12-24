import request from '@/app/request';

const { getBoards, getBoard, createBoard, editBoard, deleteBoard } = require('@/app/requests/board');
const { boardOne, boardTwo } = require('../../fixtures/board.fixture');
const { adminAccessToken } = require('../../fixtures/token.fixture');

jest.mock('@/app/request');

describe('Bans request', () => {
  afterEach(() => {
    request.mockReset();
  });

  describe('getBoards()', () => {
    beforeEach(() => {
      request.mockResolvedValue([boardOne, boardTwo]);
    });

    test('should send request to get a list of boards', async () => {
      await expect(getBoards(adminAccessToken)).resolves.toEqual([boardOne, boardTwo]);
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: '/api/board/?sortBy=name:desc',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(getBoards()).rejects.toThrow('Access token is not set');
    });
  });

  describe('getBoard()', () => {
    beforeEach(() => {
      request.mockResolvedValue(boardOne);
    });

    test('should send request to get single board succesfully', async () => {
      await expect(getBoard(adminAccessToken, { id: boardOne._id })).resolves.toBe(boardOne);
      const options = request.mock.calls[0][0];
      expect(options).toMatchObject({
        url: `/api/board/${boardOne._id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });
    });

    test('should reject if access token is not set', async () => {
      await expect(getBoard(undefined, { id: boardOne._id })).rejects.toThrow('Access token is not set');
    });
  });

  describe('createBoard()', () => {
    let newBoard;

    beforeEach(() => {
      newBoard = boardOne;
      request.mockResolvedValue(newBoard);
    });

    test('should send request to create board succesfully', async () => {
      await expect(createBoard(adminAccessToken, newBoard)).resolves.toEqual(boardOne);
    });

    test('should reject if access token is not set', async () => {
      await expect(createBoard(undefined, newBoard)).rejects.toThrow('Access token is not set');
    });
  });

  describe('editBoard()', () => {
    let newBoard;

    beforeEach(() => {
      newBoard = {
        desc: 'test',
      };
      request.mockResolvedValue(newBoard);
    });

    test('should send request to edit board succesfully', async () => {
      await expect(editBoard(adminAccessToken, newBoard)).resolves.toEqual(newBoard);
    });

    test('should reject if access token is not set', async () => {
      await expect(editBoard(undefined, newBoard)).rejects.toThrow('Access token is not set');
    });
  });

  describe('deleteBoard()', () => {
    beforeEach(() => {
      request.mockResolvedValue(undefined);
    });

    test('should send request of board delete', async () => {
      await expect(deleteBoard(adminAccessToken, boardOne._id)).resolves.toBe(undefined);
    });

    test('should reject if access token is not set', async () => {
      await expect(deleteBoard(undefined, boardOne._id)).rejects.toThrow('Access token is not set');
    });
  });
});
