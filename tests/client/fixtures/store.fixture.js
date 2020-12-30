import moment from 'moment';
import Vuex from 'vuex';
import { shallowMount, mount } from '@vue/test-utils';

const tokens = {
  refresh: {
    token: 'some token',
    expires: moment().add(1, 'days'),
  },
  access: {
    token: 'some token',
    expires: moment().add(5, 'minutes'),
  },
};

const storeFixture = {
  state: {
    tokens,
    refreshTokenTask: 1,
  },
  getters: {
    accessToken: tokens.access,
  },
  dispatch: jest.fn(),
  commit: jest.fn(),
};

const createWrapper = (component, localVue, overrides, shallow = true) => {
  const defaults = {
    localVue,
    store: new Vuex.Store({
      getters: {
        accessToken: () => ({ token: 'some token here' }),
      },
    }),
    mocks: {
      $router: {
        push: jest.fn(),
      },
      $route: {
        query: {},
        params: {},
      },
    },
    stubs: ['router-link', 'router-view'],
  };
  if (shallow) return shallowMount(component, Object.assign(defaults, overrides));
  return mount(component, Object.assign(defaults, overrides));
};

module.exports = {
  storeFixture,
  createWrapper,
};
