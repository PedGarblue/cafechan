import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_REQUEST } from '@/app/store/actions/auth';
import Login from '@/app/components/panel/pages/login.vue';
import createWrapper from '../../../fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('login.vue', () => {
  let wrapper;
  let store;
  let $router;

  beforeEach(() => {
    $router = {
      push: jest.fn(),
    };

    store = {
      getters: {
        authStatus: () => '',
      },
      actions: {
        [AUTH_REQUEST]: jest.fn(),
      },
    };
    wrapper = createWrapper(Login, localVue, { store: new Vuex.Store(store), mocks: { $router } });
  });

  describe('Implementation tests', () => {
    describe('login() Method', () => {
      test('should dispatch AUTH_REQUEST and redirect to "/"', async () => {
        store.actions[AUTH_REQUEST].mockResolvedValue({});
        await wrapper.vm.login();
        expect(store.actions[AUTH_REQUEST]).toBeCalled();
        expect($router.push).toBeCalledWith('/');
      });

      test('should set errorMsg if login() fails', async () => {
        store.actions[AUTH_REQUEST].mockRejectedValue(new Error('some error'));
        await wrapper.vm.login();
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });

  describe('Behavorial tests', () => {
    describe('login form', () => {
      it('triggers login() on submit', async () => {
        wrapper.vm.login = jest.fn();
        await wrapper.find('form').trigger('submit');
        expect(wrapper.vm.login).toBeCalled();
      });
    });
  });
});
