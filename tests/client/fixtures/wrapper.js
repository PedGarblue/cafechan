import Vuex from 'vuex';
import { shallowMount, mount } from '@vue/test-utils';

export default (component, localVue, overrides, shallow = true) => {
  const defaults = {
    localVue,
    store: new Vuex.Store({}),
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
