import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import ThreadPage from '@/app/components/board/pages/thread.vue';
import PostBox from '@/app/components/board/lib/postbox.vue';
import Thread from '@/app/components/board/lib/thread.vue';
import { getThread } from '@/app/requests/post';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import { boardOne } from '@/tests/client/fixtures/board.fixture';
import { threadOne } from '@/tests/client/fixtures/posts.fixtures';
import createWrapper from '@/tests/client/fixtures/wrapper';

jest.mock('@/app/requests/post');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ThreadPage component', () => {
  let options;
  let status;

  beforeEach(() => {
    getThread.mockResolvedValue(threadOne);
    status = 'SUCCESS';
    options = {
      data() {
        return {
          thread: threadOne,
          status,
        };
      },
      store: new Vuex.Store(storeMock),
      mocks: {
        $route: {
          params: {},
        },
      },
    };
  });

  describe('Implementation tests', () => {
    test('initializes with correct elements', () => {
      const wrapper = createWrapper(ThreadPage, localVue, options);

      const postbox = wrapper.findComponent(PostBox);
      const thread = wrapper.findComponent(Thread);
      expect(postbox.exists()).toBeTruthy();
      expect(thread.exists()).toBeTruthy();
    });

    test('should use the route param "threadid" to default the state property thread.seq_id', async () => {
      delete options.data;
      options.mocks.$route.params = {
        threadid: threadOne.seq_id,
      };
      const wrapper = createWrapper(ThreadPage, localVue, options);

      expect(wrapper.vm.thread.seq_id).toEqual(threadOne.seq_id);
    });
  });

  describe('behavorial tests', () => {
    test('should call getThread request when mounted', async () => {
      delete options.data;
      options.mocks.$route.params = {
        threadid: threadOne.seq_id,
      };
      storeMock.getters.getBoard.mockReturnValue(boardOne);
      const wrapper = createWrapper(ThreadPage, localVue, options);
      expect(wrapper.vm.status).toEqual('REQUEST');
      await wrapper;
      expect(getThread).toBeCalledWith(boardOne.name, threadOne.seq_id);
      expect(wrapper.vm.status).toEqual('SUCCESS');
      expect(wrapper.vm.thread).toEqual(threadOne);
    });

    test('should show error message in button area if getThread request fails', async () => {
      getThread.mockRejectedValue(new Error('some error'));
      const wrapper = createWrapper(ThreadPage, localVue, options);
      await wrapper.vm.getThread();
      expect(wrapper.vm.status).toEqual('ERROR');
      expect(wrapper.vm.errorMsg).toEqual('some error');
      const button = wrapper.find('.update-button');
      expect(button.text()).toEqual('Error!');
    });

    test('should call getThread when update button is clicked', async () => {
      const wrapper = createWrapper(ThreadPage, localVue, options);
      getThread.mockClear(); // just in case
      const button = wrapper.find('.update-button');
      await button.trigger('click');
      expect(getThread).toBeCalledWith(boardOne.name, threadOne.seq_id);
    });

    test('setQuickReply method should set QuickReply params in the PostBox', async () => {
      const wrapper = createWrapper(ThreadPage, localVue, options);
      const postbox = wrapper.findComponent(PostBox);

      await wrapper.vm.setQuickReply(threadOne);

      expect(postbox.vm.type).toEqual('QuickReply');
    });

    test('unsetQuickReply method should set postbox to thread posting mode', async () => {
      options.data = function() {
        return {
          posting: {
            type: 'QuickReply',
          },
          thread: threadOne,
          status,
        };
      };
      const wrapper = createWrapper(ThreadPage, localVue, options);
      const postbox = wrapper.findComponent(PostBox);

      await wrapper.vm.unsetQuickReply();

      expect(postbox.vm.type).toEqual('Reply');
    });
  });
});
