import request from '@/app/request';
import storeModule from '@/app/store/modules/board';
import { BOARD_REQUEST, BOARD_SUCCESS, BOARD_ERROR } from '@/app/store/actions/board';

jest.mock('@/app/request');

describe('Board Global Store', () => {
  let stateModules;

  beforeEach(() => {
    stateModules = {
      dispatch: jest.fn(),
      commit: jest.fn(),
    };
  });

  afterEach(() => {
    request.mockClear();
  });

  describe('Actions', () => {
    let board;
    let boardpage;

    beforeEach(() => {
      board = {
        boardname: 'test',
      };
      boardpage = {
        board: {},
        sections: [],
        threads: [],
        page: {},
      };
      request.mockResolvedValue(boardpage);
    });

    afterEach(() => {
      stateModules.commit.mockClear();
      stateModules.dispatch.mockClear();
    });

    describe('BOARD_REQUEST', () => {
      test('should fetch board successfully and commit BOARD_SUCCESS', async () => {
        await expect(storeModule.actions[BOARD_REQUEST](stateModules, board)).resolves.toEqual(boardpage);
        expect(stateModules.commit).nthCalledWith(1, BOARD_REQUEST);
        expect(stateModules.commit).nthCalledWith(2, BOARD_SUCCESS, boardpage);
        expect(request).toBeCalledWith({
          url: `/${board.boardname}/1`,
          method: 'GET',
        });
      });

      test('should fetch board by page', async () => {
        board.page = 3;
        await expect(storeModule.actions[BOARD_REQUEST](stateModules, board)).resolves.toEqual(boardpage);
        expect(request).toBeCalledWith({
          url: `/${board.boardname}/${board.page}`,
          method: 'GET',
        });
      });

      test('should default page 1 of board if page param is not set', async () => {
        await expect(storeModule.actions[BOARD_REQUEST](stateModules, board)).resolves.toEqual(boardpage);
        expect(request).toBeCalledWith({
          url: `/${board.boardname}/1`,
          method: 'GET',
        });
      });

      test('should commit BOARD_ERROR if board fetch fails', async () => {
        request.mockRejectedValue(new Error('some error'));
        await expect(storeModule.actions[BOARD_REQUEST](stateModules, board)).rejects.toThrow();
        expect(stateModules.commit).nthCalledWith(1, BOARD_REQUEST);
        expect(stateModules.commit).nthCalledWith(2, BOARD_ERROR);
      });
    });
  });
});
