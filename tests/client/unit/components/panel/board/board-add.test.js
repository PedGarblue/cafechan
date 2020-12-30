import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BoardAdd from '@/app/components/panel/pages/board/board-add.vue';
import { createBoard } from '@/app/requests/board';
import { omit } from 'lodash';
import storeFixtures from '../../../../fixtures/store.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/board');

describe('board-add.vue', () => {
  let wrapper;

  beforeEach(() => {
    createBoard.mockResolvedValue();
  });

  afterEach(() => {
    createBoard.mockClear();
  });

  describe('Implementation tests', () => {
    describe('sendBoard() method', () => {
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
      });

      test('should call Request.createBoard() correctly', async () => {
        wrapper = storeFixtures.createWrapper(BoardAdd, localVue, {
          data() {
            return { board: newBoard };
          },
        });
        await wrapper.vm.createBoard();
        expect(createBoard).toBeCalledWith('some token here', newBoard);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.createBoard() fails', async () => {
        createBoard.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(BoardAdd, localVue, {
          data() {
            return { board: newBoard };
          },
        });
        await wrapper.vm.createBoard();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });

      test('should omit flag if board section is not regional', async () => {
        newBoard.flag = 'test';
        wrapper = storeFixtures.createWrapper(BoardAdd, localVue, {
          data() {
            return { board: newBoard };
          },
        });
        await wrapper.vm.createBoard();
        expect(createBoard).toBeCalledWith('some token here', omit(newBoard, ['flag']));
      });
    });
  });

  describe('Behavorial tests', () => {
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
    });

    test('should enable flag input block if board section is regional', async () => {
      let flagInput;

      wrapper = storeFixtures.createWrapper(BoardAdd, localVue, {
        data() {
          return { board: newBoard };
        },
      });

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeFalsy();

      newBoard.flag = 'test';
      newBoard.section = 'regional';
      await wrapper.setData({ board: newBoard });

      flagInput = wrapper.findComponent({ ref: 'flag-input' });
      expect(flagInput.exists()).toBeTruthy();
    });
  });
});
