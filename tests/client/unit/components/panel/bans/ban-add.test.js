import { createLocalVue } from '@vue/test-utils';
import faker from 'faker';
import Vuex from 'vuex';
import BansAdd from '@/app/components/panel/pages/bans/ban-add.vue';
import banTimes from '@/src/config/banTimes';
import { sendBan } from '@/app/requests/ban';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/ban');

describe('ban-add.vue Implementation tests', () => {
  let options;
  let newBan;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
    newBan = { ip: faker.internet.ip(), reason: 'Shitposting', until: banTimes.day() };
  });

  afterEach(() => {
    sendBan.mockClear();
  });

  describe('sendBan() method', () => {
    test('makes request when sendBan() is called', () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should set post to request if is avaliable', () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      delete newBan.ip;
      newBan.post = {};
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should set ip to request if is avaliable', () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      newBan.ip = faker.internet.ip();
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should not allow ip if post is set', () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      newBan.post = {};
      newBan.ip = faker.internet.ip();
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      delete newBan.ip;
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('emits custom event and changes state when sendBan() is called', async () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      wrapper.setData(newBan);
      wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('REQUEST');
      expect(wrapper.emitted('form-submit-request')).toHaveLength(1);
    });

    test('emits custom event and changes state when sendBan() resolves', async () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      wrapper.setData(newBan);
      await wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('SUCCESS');
      expect(wrapper.emitted('form-submit-request')).toHaveLength(1);
      expect(wrapper.emitted('form-submit-success')[0][0]).toMatch('Ban added correctly');
    });

    test('emit custom event and changes state when sendBan() rejects', async () => {
      const wrapper = createWrapper(BansAdd, localVue, options);
      sendBan.mockRejectedValue({ message: 'Bad request' });
      await wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('ERROR');
      expect(wrapper.emitted('form-submit-failed')).toHaveLength(1);
      expect(wrapper.emitted('form-submit-failed')[0][0]).toMatch('Ban request failed: Bad request');
    });
  });
});

describe('ban-add.vue Behavorial tests', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
  });

  afterEach(() => {
    sendBan.mockClear();
  });

  test('should add post if is avaliable in the route query', () => {
    options.mocks = {
      $route: {
        query: {
          post: 'some post id',
        },
      },
    };
    const wrapper = createWrapper(BansAdd, localVue, options);

    expect(wrapper.vm.post).toEqual('some post id');
  });
});
