import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Thread from '@/app/components/board/lib/thread.vue';
import Reply from '@/app/components/board/lib/reply.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import { threadOne, replyOne, replyTwo } from '@/tests/client/fixtures/posts.fixtures';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Thread component', () => {
  let options;

  beforeEach(() => {
    options = {
      propsData: {
        data: threadOne,
      },
      store: storeMock,
    };
  });

  test('initializes with correct elements', () => {
    const wrapper = createWrapper(Thread, localVue, options);

    const fileContainer = wrapper.find('.post-file');
    const title = wrapper.find('.title');
    const name = wrapper.find('.postername');
    const timestamp = wrapper.find('.timestamp');
    const reflink = wrapper.find('.reflink a');
    const message = wrapper.find('.post-message');

    expect(fileContainer.exists()).toBeFalsy();
    expect(title.text()).toEqual(threadOne.title);
    expect(name.text()).toEqual(threadOne.name);
    expect(timestamp.text()).toEqual(threadOne.timestamp);
    expect(reflink.text()).toMatch(`#${threadOne.seq_id}`);
    expect(message.text()).toMatch(threadOne.message);
  });

  test('should show file thumbnail if thread has files', async () => {
    options.propsData.data.file = {
      thumbnailUrl: 'http://localhost:3000/some-thumb-url',
      url: 'http://localhost:3000/some-url',
    };
    const wrapper = createWrapper(Thread, localVue, options);
    const fileContainer = wrapper.find('.post-file');
    const file = fileContainer.find('img');

    expect(fileContainer.exists()).toBeTruthy();
    expect(file.element.src).toEqual('http://localhost:3000/some-thumb-url');
  });

  test('toggles file thumbnail correctly', async () => {
    let file;
    options.propsData.data.file = {
      thumbnailUrl: 'http://localhost:3000/some-thumb-url',
      url: 'http://localhost:3000/some-url',
    };
    const wrapper = createWrapper(Thread, localVue, options);
    const fileContainer = wrapper.find('.post-file');
    expect(wrapper.vm.openFile).toBeFalsy();

    await fileContainer.trigger('click');
    file = wrapper.find('img');

    expect(wrapper.vm.openFile).toBeTruthy();
    expect(fileContainer.classes()).toContain('open-file');
    expect(file.element.src).toEqual('http://localhost:3000/some-url');

    await fileContainer.trigger('click');
    file = wrapper.find('img');

    expect(wrapper.vm.openFile).toBeFalsy();
    expect(fileContainer.classes()).not.toContain('open-file');
    expect(file.element.src).toEqual('http://localhost:3000/some-thumb-url');
  });

  test('should show all replies correctly', () => {
    options.propsData.data.replies = [replyOne, replyTwo];
    const wrapper = createWrapper(Thread, localVue, options);
    const repliesContainer = wrapper.find('.replies');
    const replies = wrapper.findAllComponents(Reply);

    expect(repliesContainer.exists()).toBeTruthy();
    expect(replies).toHaveLength(2);
  });

  test("should not show replies container if thread don't has replies", () => {
    options.propsData.data.replies = [];
    const wrapper = createWrapper(Thread, localVue, options);
    const repliesContainer = wrapper.find('.replies');

    expect(repliesContainer.exists()).toBeFalsy();
  });

  test('should emit custom event when reflink is clicked', async () => {
    const wrapper = createWrapper(Thread, localVue, options);
    const reflink = wrapper.find('.reflink a');
    await reflink.trigger('click');
    expect(wrapper.emitted('set-reply')).toHaveLength(1);
    expect(wrapper.emitted('set-reply')[0]).toEqual([threadOne]);
  });

  test('should emit custom event when a Reply is emitting set-reply', async () => {
    options.propsData.data.replies = [replyOne, replyTwo];
    const wrapper = createWrapper(Thread, localVue, options);
    const replies = wrapper.findAllComponents(Reply);
    await replies.at(0).vm.$emit('set-reply');
    expect(wrapper.emitted('set-reply')).toHaveLength(1);
    expect(wrapper.emitted('set-reply')[0]).toEqual([threadOne]);
  });
});
