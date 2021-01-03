import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Board from '@/app/components/board/pages/main.vue';
import PostBox from '@/app/components/board/lib/postbox.vue';
import Thread from '@/app/components/board/lib/thread.vue';
import Pagination from '@/app/components/board/lib/pagination.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { threadOne, threadTwo } from '@/tests/client/fixtures/posts.fixtures';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Board component', () => {
  describe('Implementation tests', () => {
    test('initializes with correct elements', () => {
      const wrapper = createWrapper(Board, localVue, { store: new Vuex.Store(storeMock) });

      const postbox = wrapper.findComponent(PostBox);
      expect(postbox.exists()).toBeTruthy();
      const pagination = wrapper.findComponent(Pagination);
      expect(pagination.exists()).toBeTruthy();
      const threadList = wrapper.find('.threads');
      expect(threadList.exists()).toBeTruthy();
    });

    test('renders thread list correctly', () => {
      const getThreads = jest.fn(() => [threadOne, threadTwo]);
      storeMock.getters.getThreads = getThreads;
      const wrapper = createWrapper(Board, localVue, { store: new Vuex.Store(storeMock) });
      const threads = wrapper.findAllComponents(Thread);
      expect(threads).toHaveLength(2);
    });
  });
});
