import faker from 'faker';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

import { sendPost } from '@/app/requests/post';
import PostBox from '@/app/components/board/lib/postbox.vue';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { boardOne } from '@/tests/client/fixtures/board.fixture';
import { threadOne } from '@/tests/client/fixtures/posts.fixtures';

jest.mock('@/app/requests/post');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('PostBox component', () => {
  const sendThread = jest.fn();
  const sendReply = jest.fn();

  beforeEach(() => {
    sendThread.mockResolvedValue();
    sendReply.mockResolvedValue();
    sendPost.mockReturnValue({
      thread: sendThread,
      reply: sendReply,
    });
  });

  afterEach(() => {
    sendPost.mockClear();
    sendThread.mockClear();
    sendReply.mockClear();
  });

  test('initializes as thread with correct elements', () => {
    const wrapper = createWrapper(PostBox, localVue);
    const titleInput = wrapper.find('.input__title');
    const messageInput = wrapper.find('.input__message');
    const fileInput = wrapper.find('.input__file');
    expect(titleInput.exists()).toBeTruthy();
    expect(messageInput.exists()).toBeTruthy();
    expect(fileInput.exists()).toBeTruthy();
  });

  test('initializes as reply with correct elements', () => {
    const propsData = {
      type: 'Reply',
      boardid: boardOne._id,
      threadid: threadOne._id,
    };
    const wrapper = createWrapper(PostBox, localVue, { propsData });
    const titleInput = wrapper.find('.input__title');
    const messageInput = wrapper.find('.input__message');
    const fileInput = wrapper.find('.input__file');

    expect(titleInput.exists()).toBeFalsy();
    expect(messageInput.exists()).toBeTruthy();
    expect(fileInput.exists()).toBeTruthy();
  });

  describe('sendPost method', () => {
    let post;
    let options;

    beforeEach(() => {
      post = {
        title: faker.lorem.words(4),
        message: faker.lorem.paragraph(),
        file: '',
      };
      const data = function() {
        return {
          post,
        };
      };
      const propsData = {
        type: 'Thread',
        boardid: boardOne._id,
      };
      options = {
        propsData,
        data,
      };
    });

    test('should send post thread request correctly', async () => {
      const wrapper = createWrapper(PostBox, localVue, options);
      const request = wrapper.vm.sendPost();
      expect(sendPost).toBeCalledWith(boardOne._id);
      expect(wrapper.vm.status).toEqual('LOADING');
      await request;
      expect(sendThread).toBeCalledWith(post);
      expect(wrapper.vm.status).toEqual('SUCCESS');
    });

    test('should send post reply request correctly', async () => {
      options.propsData.type = 'Reply';
      options.propsData.threadid = threadOne._id;
      post = {
        message: faker.lorem.paragraph(),
      };
      const wrapper = createWrapper(PostBox, localVue, options);
      const request = wrapper.vm.sendPost();
      expect(sendPost).toBeCalledWith(boardOne._id);
      expect(wrapper.vm.status).toEqual('LOADING');
      await request;
      expect(sendReply).toBeCalledWith(threadOne._id, post);
      expect(wrapper.vm.status).toEqual('SUCCESS');
    });

    test('should clear the inputs and emit custom event when successfully posted', async () => {
      const wrapper = createWrapper(PostBox, localVue, options);
      await wrapper.vm.sendPost();
      expect(wrapper.vm.post).toEqual({
        title: '',
        message: '',
        file: '',
      });
      expect(wrapper.emitted().posted).toHaveLength(1);
    });

    test('should set status to ERROR if post request fails', async () => {
      sendThread.mockRejectedValue(new Error('some error'));
      const wrapper = createWrapper(PostBox, localVue, options);
      await wrapper.vm.sendPost();
      expect(wrapper.vm.status).toEqual('ERROR');
      expect(wrapper.vm.errorMsg).toEqual('some error');
    });
  });

  describe('handleFileUpload method', () => {
    let wrapper;
    let localImageInput;
    let localImageInputFilesGet;

    beforeEach(() => {
      wrapper = createWrapper(PostBox, localVue);
      // we dont have DataTransfer object in jest jsdom, so, we will mock it
      localImageInput = wrapper.findComponent({ ref: 'postfile' });
      localImageInputFilesGet = jest.fn();

      // for now element.files will be mocked
      // is the same process if you want to mock element.value
      Object.defineProperty(localImageInput.element, 'files', {
        get: localImageInputFilesGet,
      });
    });

    test('should set file to state when a file is selected', async () => {
      localImageInputFilesGet.mockReturnValue([
        {
          size: 12345,
          block: 'some-blob',
          width: 300,
          height: 200,
        },
      ]);
      await wrapper.vm.$nextTick();
      await localImageInput.trigger('change');
      expect(wrapper.vm.post.file).toEqual({
        size: 12345,
        block: 'some-blob',
        width: 300,
        height: 200,
      });
    });
  });
});
