import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BoardEdit from '@/app/components/panel/pages/board/board-edit.vue';
import { getBoard, editBoard } from '@/app/requests/board';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/board');

describe('board-edit.vue', () => {
  let options;
  let newBoard;

  beforeEach(() => {
    newBoard = {
      name: 'test',
      desc: 'Testing',
      section: 'ocio',
      allowedfiletypes: [],
      maxfilesize: 10000000,
      locked: false,
      maxpages: 7,
      maxreplies: 200,
      postsperpage: 10,
      nsfw: false,
      flag: '',
    };

    options = {
      data() {
        return {
          id: 'some id here',
          board: newBoard,
        };
      },
      store: new Vuex.Store(storeMock),
    };

    editBoard.mockResolvedValue();
    getBoard.mockResolvedValue(newBoard);
  });

  afterEach(() => {
    editBoard.mockClear();
    getBoard.mockClear();
  });

  describe('Implementation tests', () => {
    describe('getBoard() method', () => {
      test('should call Request.getBoard() correctly', async () => {
        const wrapper = createWrapper(BoardEdit, localVue, options);
        await wrapper.vm.getBoard();
        expect(getBoard).toBeCalledWith('some token here', { id: 'some id here' });
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.getBoard() fails', async () => {
        getBoard.mockRejectedValue(new Error('some error'));
        const wrapper = createWrapper(BoardEdit, localVue, options);
        await wrapper.vm.getBoard();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('editBoard() method', () => {
      test('should call Request.editBoard correctly', async () => {
        const wrapper = createWrapper(BoardEdit, localVue, options);
        await wrapper.setData({
          board: {
            desc: 'testos',
          },
        });
        newBoard.desc = 'testos';
        await wrapper.vm.editBoard();
        expect(editBoard).toBeCalledWith('some token here', 'some id here', newBoard);
        expect(wrapper.vm.status).toEqual('SUCCESS');
        expect(wrapper.vm.successEdit).toBeTruthy();
      });

      test('should set state to ERROR if Request.editBoard() fails', async () => {
        editBoard.mockRejectedValue(new Error('some error'));
        const wrapper = createWrapper(BoardEdit, localVue, options);
        await wrapper.vm.editBoard();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });

  describe('Behavioral tests', () => {
    test('should use the route param "boardId" as default boardId', async () => {
      delete options.data;
      options.mocks = {
        $route: {
          params: {
            boardId: 'some id',
          },
        },
      };
      const wrapper = createWrapper(BoardEdit, localVue, options);
      expect(wrapper.vm.id).toEqual('some id');
    });

    test('should enable flag input block if board section is regional', async () => {
      let flagInput;
      const wrapper = createWrapper(BoardEdit, localVue, options);

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeFalsy();

      await wrapper.setData({ board: { section: 'regional' } });

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeTruthy();
    });
  });
});
