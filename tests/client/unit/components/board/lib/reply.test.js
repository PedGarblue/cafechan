import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Reply from '@/app/components/board/lib/reply.vue';
import { replyOne } from '@/tests/client/fixtures/posts.fixtures';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Thread component', () => {
  let options;

  beforeEach(() => {
    options = {
      propsData: {
        data: replyOne,
      },
      store: storeMock,
    };
  });

  test('initializes with correct elements', () => {
    const wrapper = createWrapper(Reply, localVue, options);

    const fileContainer = wrapper.find('.post-file');
    const name = wrapper.find('.postername');
    const timestamp = wrapper.find('.timestamp');
    const reflink = wrapper.find('.reflink a');
    const message = wrapper.find('.post-message');

    expect(fileContainer.exists()).toBeFalsy();
    expect(name.text()).toEqual(replyOne.name);
    expect(timestamp.text()).toEqual(replyOne.timestamp);
    expect(reflink.text()).toMatch(`#${replyOne.seq_id}`);
    expect(message.text()).toMatch(replyOne.message);
  });

  test('should show file thumbnail if thread has files', async () => {
    options.propsData.data.file = {
      thumbnailUrl: 'http://localhost:3000/some-thumb-url',
      url: 'http://localhost:3000/some-url',
    };
    const wrapper = createWrapper(Reply, localVue, options);
    const fileContainer = wrapper.find('.post-file');
    const file = fileContainer.find('img');

    expect(fileContainer.exists()).toBeTruthy();
    expect(file.element.src).toEqual('http://localhost:3000/some-thumb-url');
  });

  test('toggles file thumbnail correctly', async () => {
    let file;
    let postContents;
    options.propsData.data.file = {
      thumbnailUrl: 'http://localhost:3000/some-thumb-url',
      url: 'http://localhost:3000/some-url',
    };
    const wrapper = createWrapper(Reply, localVue, options);
    const fileContainer = wrapper.find('.post-file');
    file = fileContainer.find('img');

    expect(wrapper.vm.openfile).toBeFalsy();
    expect(file.element.src).toEqual('http://localhost:3000/some-thumb-url');

    await fileContainer.trigger('click');
    postContents = wrapper.find('.post-contents');
    file = wrapper.find('img');

    expect(wrapper.vm.openfile).toBeTruthy();
    expect(postContents.classes()).toContain('open-file');
    expect(file.element.src).toEqual('http://localhost:3000/some-url');

    await fileContainer.trigger('click');
    postContents = wrapper.find('.post-contents');
    file = wrapper.find('img');

    expect(wrapper.vm.openfile).toBeFalsy();
    expect(postContents.classes()).not.toContain('open-file');
    expect(file.element.src).toEqual('http://localhost:3000/some-thumb-url');
  });

  test('should emit custom event when reflink is clicked', async () => {
    const wrapper = createWrapper(Reply, localVue, options);
    const reflink = wrapper.find('.reflink a');
    await reflink.trigger('click');
    expect(wrapper.emitted('set-reply')).toHaveLength(1);
  });
});
