import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { getPosts, removePost } from '@/app/requests/post';
import PostsList from '@/app/components/panel/pages/posts/index.vue';
import storeFixtures from '../../../../fixtures/store.fixture';
import { threadOne, threadTwo } from '../../../../fixtures/posts.fixtures';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/post');

describe('PostsList', () => {
  let wrapper;

  beforeEach(() => {
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
        wrapper = storeFixtures.createWrapper(PostsList, localVue);
        getPosts.mockResolvedValue([threadOne, threadTwo]);
        await wrapper.vm.updatePosts();
        expect(getPosts).toBeCalledWith('some token here');
        expect(wrapper.vm.status).toEqual('SUCCESS');
        expect(wrapper.vm.posts).toEqual([threadOne, threadTwo]);
      });

      test('should set state to ERROR if getPosts() request fails', async () => {
        getPosts.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(PostsList, localVue);
        await wrapper.vm.updatePosts();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('removePost() method', () => {
      test('should call removePost() request correctly', async () => {
        wrapper = storeFixtures.createWrapper(PostsList, localVue);
        await wrapper.vm.removePost(threadOne);
        expect(removePost).toBeCalledWith('some token here', threadOne);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if removePost() request fails', async () => {
        wrapper = storeFixtures.createWrapper(PostsList, localVue);
        removePost.mockRejectedValue(new Error('some error'));
        await wrapper.vm.removePost(threadOne);
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('banPoster() method', () => {
      test('should redirect to ban-add page with post id in the params', async () => {
        wrapper = storeFixtures.createWrapper(PostsList, localVue);
        wrapper.vm.banPoster(threadOne);
        expect(wrapper.vm.$router.push).toBeCalledWith({ name: 'ban-add', query: { post: threadOne.id } });
      });
    });
  });
});
