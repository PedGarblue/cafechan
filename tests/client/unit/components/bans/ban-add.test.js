import { shallowMount, createLocalVue } from '@vue/test-utils';
import faker from 'faker';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import BansAdd from '../../../../../app/components/bans/ban-add.vue';
import banTimes from '../../../../../src/config/banTimes';
import { sendBan } from '../../../../../app/requests/ban';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const router = new VueRouter();

jest.mock('../../../../../app/requests/ban');

const createWrapper = overrides => {
  const defaults = {
    localVue,
    router,
    store: new Vuex.Store({
      getters: {
        accessToken: () => ({ token: 'some token here' }),
      },
    }),
  };
  return shallowMount(BansAdd, Object.assign(defaults, overrides));
};

describe('ban-add.vue Implementation tests', () => {
  let wrapper;
  let newBan;

  beforeEach(() => {
    wrapper = createWrapper();
    newBan = { ip: faker.internet.ip(), reason: 'Shitposting', until: banTimes.day() };
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test('makes request when sendBan() is called', () => {
    wrapper.setData(newBan);
    wrapper.vm.sendBan();

    expect(sendBan.mock.calls.length).toEqual(1);
    expect(sendBan.mock.calls[0][0]).toEqual('some token here');
    expect(sendBan.mock.calls[0][1]).toEqual(newBan);
  });

  test('emits custom event and changes state when sendBan() is called', async () => {
    wrapper.setData(newBan);
    wrapper.vm.sendBan();

    expect(wrapper.vm.status).toMatch('REQUEST');
    expect(wrapper.emitted('form-submit-request')).toBeTruthy();
    expect(wrapper.emitted('form-submit-request').length).toEqual(1);
  });

  test('emits custom event and changes state when sendBan() resolves', async () => {
    wrapper.setData(newBan);
    await wrapper.vm.sendBan();

    expect(wrapper.vm.status).toMatch('SUCCESS');
    expect(wrapper.emitted('form-submit-success')).toBeTruthy();
    expect(wrapper.emitted('form-submit-success').length).toEqual(1);
    expect(wrapper.emitted('form-submit-success')[0][0]).toMatch('Ban added correctly');
  });

  test('emit custom event and changes state when sendBan() rejects', async () => {
    sendBan.mockRejectedValue({ message: 'Bad request' });
    await wrapper.vm.sendBan();

    expect(wrapper.vm.status).toMatch('ERROR');
    expect(wrapper.emitted('form-submit-failed')).toBeTruthy();
    expect(wrapper.emitted('form-submit-failed').length).toEqual(1);
    expect(wrapper.emitted('form-submit-failed')[0][0]).toMatch('Ban request failed: Bad request');
  });
});

describe('ban-add.vue Behavorial tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
