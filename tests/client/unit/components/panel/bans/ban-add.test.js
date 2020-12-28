import { createLocalVue } from '@vue/test-utils';
import faker from 'faker';
import Vuex from 'vuex';
import BansAdd from '@/app/components/panel/pages/bans/ban-add.vue';
import banTimes from '@/src/config/banTimes';
import { sendBan } from '@/app/requests/ban';
import storeFixtures from '../../../../fixtures/store.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/ban');

describe('ban-add.vue Implementation tests', () => {
  let wrapper;
  let newBan;

  beforeEach(() => {
    wrapper = storeFixtures.createWrapper(BansAdd, localVue);
    newBan = { ip: faker.internet.ip(), reason: 'Shitposting', until: banTimes.day() };
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('sendBan() method', () => {
    test('makes request when sendBan() is called', () => {
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should set post to request if is avaliable', () => {
      delete newBan.ip;
      newBan.post = {};
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should set ip to request if is avaliable', () => {
      newBan.ip = faker.internet.ip();
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('should not allow ip if post is set', () => {
      newBan.post = {};
      newBan.ip = faker.internet.ip();
      wrapper.setData(newBan);
      wrapper.vm.sendBan();
      delete newBan.ip;
      expect(sendBan).toBeCalledWith('some token here', newBan);
    });

    test('emits custom event and changes state when sendBan() is called', async () => {
      wrapper.setData(newBan);
      wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('REQUEST');
      expect(wrapper.emitted('form-submit-request')).toHaveLength(1);
    });

    test('emits custom event and changes state when sendBan() resolves', async () => {
      wrapper.setData(newBan);
      await wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('SUCCESS');
      expect(wrapper.emitted('form-submit-request')).toHaveLength(1);
      expect(wrapper.emitted('form-submit-success')[0][0]).toMatch('Ban added correctly');
    });

    test('emit custom event and changes state when sendBan() rejects', async () => {
      sendBan.mockRejectedValue({ message: 'Bad request' });
      await wrapper.vm.sendBan();

      expect(wrapper.vm.status).toMatch('ERROR');
      expect(wrapper.emitted('form-submit-failed')).toHaveLength(1);
      expect(wrapper.emitted('form-submit-failed')[0][0]).toMatch('Ban request failed: Bad request');
    });
  });
});

describe('ban-add.vue Behavorial tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = storeFixtures.createWrapper(BansAdd, localVue);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test('should add post if is avaliable in the route query', () => {
    wrapper = storeFixtures.createWrapper(BansAdd, localVue, {
      mocks: {
        $route: {
          query: {
            post: 'some post id',
          },
        },
      },
    });

    expect(wrapper.vm.post).toEqual('some post id');
  });
});
