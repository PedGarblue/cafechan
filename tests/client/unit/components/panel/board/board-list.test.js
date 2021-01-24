import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BoardList from '@/app/components/panel/pages/board/board-list.vue';
import { getBoards, deleteBoard } from '@/app/requests/board';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { boardOne, boardTwo } from '@/tests/client/fixtures/board.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/board');

describe('ban-list.vue', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };

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
        const wrapper = createWrapper(BoardList, localVue, options);
        getBoards.mockResolvedValue([boardOne, boardTwo]);
        await wrapper.vm.getBoards();
        expect(getBoards).toBeCalledWith('some token here');
        expect(wrapper.vm.boards).toEqual([boardOne, boardTwo]);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.getBoards() fails', async () => {
        const wrapper = createWrapper(BoardList, localVue, options);
        getBoards.mockRejectedValue(new Error('some error'));
        await wrapper.vm.getBoards();
        expect(getBoards).toBeCalledWith('some token here');
        expect(wrapper.vm.errorMsg).toEqual('some error');
        expect(wrapper.vm.status).toEqual('ERROR');
      });
    });

    describe('deleteBoard() method', () => {
      test('should call Request.deleteBoard() correctly', async () => {
        const wrapper = createWrapper(BoardList, localVue, options);
        deleteBoard.mockResolvedValue();
        await wrapper.vm.deleteBoard(boardOne);
        expect(deleteBoard).toBeCalledWith('some token here', { id: boardOne._id });
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should call getBoards on success', async () => {
        const wrapper = createWrapper(BoardList, localVue, options);
        deleteBoard.mockResolvedValue();
        const getBoardsSpy = jest.spyOn(wrapper.vm, 'getBoards');
        await wrapper.vm.deleteBoard(boardOne);
        expect(getBoardsSpy).toBeCalled();
      });

      test('should change status to error and set errorMsg if Request.deleteBan() fails', async () => {
        const wrapper = createWrapper(BoardList, localVue, options);
        deleteBoard.mockRejectedValue(new Error('some error'));
        await wrapper.vm.deleteBoard(boardOne);
        expect(wrapper.vm.errorMsg).toEqual('some error');
        expect(wrapper.vm.status).toEqual('ERROR');
      });
    });
  });

  describe('Behavorial tests', () => {
    test('should call getBoards() when mounted', () => {
      createWrapper(BoardList, localVue, options);
      expect(getBoards).toBeCalledWith('some token here');
    });
  });
});
