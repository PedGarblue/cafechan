import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import BansList from '@/app/components/panel/pages/bans/ban-list.vue';
import { getBans, deleteBan } from '@/app/requests/ban';
import { banOne } from '../../../../fixtures/ban.fixture';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const router = new VueRouter();

jest.mock('@/app/requests/ban');

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
  return shallowMount(BansList, Object.assign(defaults, overrides));
};

describe('ban-list.vue Implemention tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper();
    getBans.mockClear();
  });

  afterEach(() => {
    wrapper.destroy();
    getBans.mockClear();
  });

  test('computed property bansList returns a formatted list of bans', () => {
    wrapper.setData({ bans: [banOne] });
    const { bansList } = wrapper.vm;
    expect(bansList).toBeInstanceOf(Array);
    expect(bansList).toHaveLength(1);
    const _ban = bansList[0];
    // matches hh:mm dd/mm/yyyy
    const dateRegex = /[0-2]?[0-9]:[0-5]?[0-9] [0-3]?[0-9]\/[0-1]?[0-9]\/\d{1,4}/gm;
    expect(_ban.until).toMatch(dateRegex);
  });

  test('calls Requests.getBans() when getBans() is called', async () => {
    await wrapper.vm.getBans();
    expect(getBans).toBeCalledWith('some token here');
  });

  test('emits custom event and changes state when getBans() is called', async () => {
    wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('REQUEST');
    expect(wrapper.emitted('table-update-request')).toHaveLength(2);
  });

  test('emits custom event and changes state when getBans() resolves', async () => {
    await wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('SUCCESS');
    expect(wrapper.emitted('table-update-success')).toHaveLength(2);
  });

  test('emits custom event and changes state when getBans() rejects', async () => {
    getBans.mockRejectedValue({ message: 'Bad request' });
    await wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('ERROR');
    expect(wrapper.emitted('table-update-failed')).toHaveLength(1);
    expect(wrapper.emitted('table-update-failed')[0][0]).toMatch('Bad request');
  });

  test('calls Request.deleteBan() when deleteBan() is called', async () => {
    const ban = { id: 'some id' };
    await wrapper.vm.deleteBan(ban);
    expect(deleteBan).toBeCalledWith('some token here', ban);
  });

  test('calls getBans() when deleteBan() resolves', async () => {
    const ban = { id: 'some id' };
    const getBansSpy = jest.spyOn(wrapper.vm, 'getBans');
    await wrapper.vm.deleteBan(ban);
    expect(getBansSpy).toBeCalled();
  });
});

describe('ban-list.vue Behavorial tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper();
    getBans.mockClear();
  });

  afterEach(() => {
    wrapper.destroy();
    getBans.mockClear();
  });

  test('initializes calling getBans()', () => {
    wrapper = createWrapper();
    expect(getBans).toBeCalled();
  });
});
