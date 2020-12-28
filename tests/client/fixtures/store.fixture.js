import moment from 'moment';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';

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

const createWrapper = (component, localVue, overrides) => {
  const defaults = {
    localVue,
    store: new Vuex.Store({
      getters: {
        accessToken: () => ({ token: 'some token here' }),
      },
    }),
    mocks: {
      $router: {},
      $route: {
        query: {},
        params: {},
      },
    },
  };
  return shallowMount(component, Object.assign(defaults, overrides));
};

module.exports = {
  storeFixture,
  createWrapper,
};
