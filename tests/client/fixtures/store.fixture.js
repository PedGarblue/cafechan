import moment from 'moment';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';

const storeFixture = {
  state: {
    tokens: {
      refresh: {
        token: 'some token',
        expires: moment().add(1, 'days'),
      },
      access: {
        token: 'some token',
        expires: moment().add(5, 'minutes'),
      },
    },
    refreshTokenTask: 1,
  },
  dispatch: jest.fn(),
  commit: jest.fn(),
};

const createWrapper = (component, localVue, overrides) => {
  const defaults = {
    localVue,
    store: new Vuex.Store({}),
    mocks: {
      $router: {},
      $route: {},
    },
  };
  return shallowMount(component, Object.assign(defaults, overrides));
};

module.exports = {
  storeFixture,
  createWrapper,
};
