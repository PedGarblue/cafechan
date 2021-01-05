import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { getPosts, removePost } from '@/app/requests/post';
import PostsList from '@/app/components/panel/pages/posts/index.vue';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { threadOne, threadTwo } from '@/tests/client/fixtures/posts.fixtures';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/post');

describe('PostsList', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
    getPosts.mockResolvedValue();
    removePost.mockResolvedValue();
  });

  afterEach(() => {
    getPosts.mockClear();
    removePost.mockClear();
  });

  describe('Implementation tests', () => {
    describe('updatePosts() method', () => {
      test('should call getPosts() request correctly', async () => {
        const wrapper = createWrapper(PostsList, localVue, options);
        getPosts.mockResolvedValue([threadOne, threadTwo]);
        await wrapper.vm.updatePosts();
        expect(getPosts).toBeCalledWith('some token here');
        expect(wrapper.vm.status).toEqual('SUCCESS');
        expect(wrapper.vm.posts).toEqual([threadOne, threadTwo]);
      });

      test('should set state to ERROR if getPosts() request fails', async () => {
        getPosts.mockRejectedValue(new Error('some error'));
        const wrapper = createWrapper(PostsList, localVue, options);
        await wrapper.vm.updatePosts();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('removePost() method', () => {
      test('should call removePost() request correctly', async () => {
        const wrapper = createWrapper(PostsList, localVue, options);
        await wrapper.vm.removePost(threadOne);
        expect(removePost).toBeCalledWith('some token here', threadOne);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if removePost() request fails', async () => {
        const wrapper = createWrapper(PostsList, localVue, options);
        removePost.mockRejectedValue(new Error('some error'));
        await wrapper.vm.removePost(threadOne);
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('banPoster() method', () => {
      test('should redirect to ban-add page with post id in the params', async () => {
        const wrapper = createWrapper(PostsList, localVue, options);
        wrapper.vm.banPoster(threadOne);
        expect(wrapper.vm.$router.push).toBeCalledWith({ name: 'ban-add', query: { post: threadOne.id } });
      });
    });
  });
});
