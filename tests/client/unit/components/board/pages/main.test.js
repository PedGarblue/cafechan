import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Board from '@/app/components/board/pages/main.vue';
import PostBox from '@/app/components/board/lib/postbox.vue';
import Thread from '@/app/components/board/lib/thread.vue';
import Pagination from '@/app/components/board/lib/pagination.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import { boardOne } from '@/tests/client/fixtures/board.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { threadOne, threadTwo } from '@/tests/client/fixtures/posts.fixtures';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Board component', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
  });

  test('initializes with correct elements', () => {
    const wrapper = createWrapper(Board, localVue, options);

    const postbox = wrapper.findComponent(PostBox);
    const paginate = wrapper.findComponent(Pagination);
    const threadList = wrapper.find('.threads');

    expect(postbox.exists()).toBeTruthy();
    expect(paginate.exists()).toBeTruthy();
    expect(threadList.exists()).toBeTruthy();
    expect(wrapper.vm.posting).toMatchObject({
      type: 'Thread',
      thread: {},
    });
  });

  test('renders thread list correctly', () => {
    const getThreads = jest.fn(() => [threadOne, threadTwo]);
    storeMock.getters.getThreads = getThreads;
    options.store = new Vuex.Store(storeMock);
    const wrapper = createWrapper(Board, localVue, options);
    const threads = wrapper.findAllComponents(Thread);
    expect(threads).toHaveLength(2);
  });

  test('should updateThreads calls BOARD_REQUEST correctly', async () => {
    storeMock.actions.BOARD_REQUEST.mockResolvedValue();
    const wrapper = createWrapper(Board, localVue, options, false);
    const postbox = wrapper.findComponent(PostBox);

    postbox.vm.$emit('posted');
    await wrapper.vm.$nextTick();

    expect(storeMock.actions.BOARD_REQUEST).toBeCalledWith(expect.anything(), { boardname: boardOne.name, page: 1 });
  });

  test('setQuickReply method should set QuickReply params in the PostBox', async () => {
    storeMock.getters.getThreads.mockReturnValue([threadOne, threadTwo]);
    options.store = new Vuex.Store(storeMock);
    const wrapper = createWrapper(Board, localVue, options);
    const postbox = wrapper.findComponent(PostBox);

    await wrapper.vm.setQuickReply(threadOne);

    expect(postbox.vm.type).toEqual('QuickReply');
    expect(postbox.vm.thread).toEqual(threadOne);
  });

  test('unsetQuickReply method should set postbox to thread posting mode', async () => {
    options.data = function() {
      return {
        posting: {
          type: 'QuickReply',
          thread: threadOne,
        },
      };
    };
    const wrapper = createWrapper(Board, localVue, options);
    const postbox = wrapper.findComponent(PostBox);
    await wrapper.vm.unsetQuickReply();
    expect(postbox.vm.type).toEqual('Thread');
    expect(postbox.vm.thread).toEqual({});
  });
});
