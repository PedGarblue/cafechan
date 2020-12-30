import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BoardList from '@/app/components/panel/pages/board/board-list.vue';
import { getBoards, deleteBoard } from '@/app/requests/board';
import storeFixtures from '../../../../fixtures/store.fixture';
import boardFixtures from '../../../../fixtures/board.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/board');

describe('ban-list.vue', () => {
  let wrapper;

  beforeEach(() => {
    getBoards.mockResolvedValue();
    deleteBoard.mockResolvedValue();
  });

  afterEach(() => {
    getBoards.mockClear();
    deleteBoard.mockClear();
  });

  describe('Implementation tests', () => {
    describe('getBoards() method', () => {
      test('should call Request.getBoards() correctly', async () => {
        wrapper = storeFixtures.createWrapper(BoardList, localVue);
        getBoards.mockResolvedValue([boardFixtures.boardOne, boardFixtures.boardTwo]);
        await wrapper.vm.getBoards();
        expect(getBoards).toBeCalledWith('some token here');
        expect(wrapper.vm.boards).toEqual([boardFixtures.boardOne, boardFixtures.boardTwo]);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.getBoards() fails', async () => {
        wrapper = storeFixtures.createWrapper(BoardList, localVue);
        getBoards.mockRejectedValue(new Error('some error'));
        await wrapper.vm.getBoards();
        expect(getBoards).toBeCalledWith('some token here');
        expect(wrapper.vm.errorMsg).toEqual('some error');
        expect(wrapper.vm.status).toEqual('ERROR');
      });
    });

    describe('deleteBoard() method', () => {
      test('should call Request.deleteBoard() correctly', async () => {
        wrapper = storeFixtures.createWrapper(BoardList, localVue);
        deleteBoard.mockResolvedValue();
        await wrapper.vm.deleteBoard(boardFixtures.boardOne);
        expect(deleteBoard).toBeCalledWith('some token here', { id: boardFixtures.boardOne._id });
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should call getBoards on success', async () => {
        wrapper = storeFixtures.createWrapper(BoardList, localVue);
        deleteBoard.mockResolvedValue();
        const getBoardsSpy = jest.spyOn(wrapper.vm, 'getBoards');
        await wrapper.vm.deleteBoard(boardFixtures.boardOne);
        expect(getBoardsSpy).toBeCalled();
      });

      test('should change status to error and set errorMsg if Request.deleteBan() fails', async () => {
        wrapper = storeFixtures.createWrapper(BoardList, localVue);
        deleteBoard.mockRejectedValue(new Error('some error'));
        await wrapper.vm.deleteBoard(boardFixtures.boardOne);
        expect(wrapper.vm.errorMsg).toEqual('some error');
        expect(wrapper.vm.status).toEqual('ERROR');
      });
    });
  });

  describe('Behavorial tests', () => {
    test('should call getBoards() when mounted', () => {
      wrapper = storeFixtures.createWrapper(BoardList, localVue);
      expect(getBoards).toBeCalledWith('some token here');
    });
  });
});
