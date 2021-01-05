import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BansList from '@/app/components/panel/pages/bans/ban-list.vue';
import { getBans, deleteBan } from '@/app/requests/ban';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { banOne } from '@/tests/client/fixtures/ban.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/ban');

describe('ban-list.vue Implemention tests', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
  });

  afterEach(() => {
    getBans.mockClear();
  });

  test('computed property bansList returns a formatted list of bans', () => {
    options.data = function() {
      return { bans: [banOne] };
    };
    const wrapper = createWrapper(BansList, localVue, options);
    const { bansList } = wrapper.vm;
    expect(bansList).toBeInstanceOf(Array);
    expect(bansList).toHaveLength(1);
    const _ban = bansList[0];
    // matches hh:mm dd/mm/yyyy
    const dateRegex = /[0-2]?[0-9]:[0-5]?[0-9] [0-3]?[0-9]\/[0-1]?[0-9]\/\d{1,4}/gm;
    expect(_ban.until).toMatch(dateRegex);
  });

  test('calls Requests.getBans() when getBans() is called', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    await wrapper.vm.getBans();
    expect(getBans).toBeCalledWith('some token here');
  });

  test('emits custom event and changes state when getBans() is called', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('REQUEST');
    expect(wrapper.emitted('table-update-request')).toHaveLength(2);
  });

  test('emits custom event and changes state when getBans() resolves', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    await wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('SUCCESS');
    expect(wrapper.emitted('table-update-success')).toHaveLength(2);
  });

  test('emits custom event and changes state when getBans() rejects', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    getBans.mockRejectedValue({ message: 'Bad request' });
    await wrapper.vm.getBans();
    expect(wrapper.vm.status).toMatch('ERROR');
    expect(wrapper.emitted('table-update-failed')).toHaveLength(1);
    expect(wrapper.emitted('table-update-failed')[0][0]).toMatch('Bad request');
  });

  test('calls Request.deleteBan() when deleteBan() is called', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    const ban = { id: 'some id' };
    await wrapper.vm.deleteBan(ban);
    expect(deleteBan).toBeCalledWith('some token here', ban);
  });

  test('calls getBans() when deleteBan() resolves', async () => {
    const wrapper = createWrapper(BansList, localVue, options);
    const ban = { id: 'some id' };
    const getBansSpy = jest.spyOn(wrapper.vm, 'getBans');
    await wrapper.vm.deleteBan(ban);
    expect(getBansSpy).toBeCalled();
  });
});

describe('ban-list.vue Behavorial tests', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
    getBans.mockClear();
  });

  afterEach(() => {
    getBans.mockClear();
  });

  test('initializes calling getBans()', () => {
    createWrapper(BansList, localVue, options);
    expect(getBans).toBeCalled();
  });
});
