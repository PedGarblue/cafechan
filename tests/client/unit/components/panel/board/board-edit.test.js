import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BoardEdit from '@/app/components/panel/pages/board/board-edit.vue';
import { getBoard, editBoard } from '@/app/requests/board';
import storeFixtures from '../../../../fixtures/store.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/board');

describe('board-edit.vue', () => {
  let wrapper;
  let wrapperOverrides;
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

    wrapperOverrides = {
      data() {
        return {
          id: 'some id here',
          board: newBoard,
        };
      },
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
        wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);
        await wrapper.vm.getBoard();
        expect(getBoard).toBeCalledWith('some token here', { id: 'some id here' });
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.getBoard() fails', async () => {
        getBoard.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);
        await wrapper.vm.getBoard();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('editBoard() method', () => {
      test('should call Request.editBoard correctly', async () => {
        wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);
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
        wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);
        await wrapper.vm.editBoard();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });

  describe('Behavioral tests', () => {
    test('should use the route param "boardId" as default boardId', async () => {
      wrapperOverrides = {
        mocks: {
          $route: {
            params: {
              boardId: 'some id',
            },
          },
        },
      };
      wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);
      expect(wrapper.vm.id).toEqual('some id');
    });

    test('should enable flag input block if board section is regional', async () => {
      let flagInput;
      wrapper = storeFixtures.createWrapper(BoardEdit, localVue, wrapperOverrides);

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeFalsy();

      await wrapper.setData({ board: { section: 'regional' } });

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeTruthy();
    });
  });
});
