import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { createLocalVue } from '@vue/test-utils';

import Main from '@/app/components/board/index.vue';
import Loading from '@/app/components/lib/loading.vue';
import Navbar from '@/app/components/board/lib/navbar.vue';
import Footer from '@/app/components/board/lib/footer.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

describe('Main component', () => {
  let localVue;
  let options;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    options = {
      store: new Vuex.Store(storeMock),
      mocks: {
        $route: {
          params: {},
        },
      },
    };
  });

  afterEach(() => {
    storeMock.actions.BOARD_REQUEST.mockClear();
  });

  describe('Implementation tests', () => {
    test('Initalizes with correct elements', async () => {
      const wrapper = createWrapper(Main, localVue, options);
      const navbars = wrapper.findAllComponents(Navbar);
      const pageBody = wrapper.findAllComponents({ ref: 'page-body' });
      const footer = wrapper.findAllComponents(Footer);
      expect(navbars).toHaveLength(2);
      expect(pageBody).toHaveLength(1);
      expect(pageBody.at(0).exists()).toBeTruthy();
      expect(footer).toHaveLength(1);
      expect(footer.at(0).exists()).toBeTruthy();
    });

    test('should use the route params "boardname" and "page" to default state properties', async () => {
      options.mocks.$route.params = {
        boardname: 'test',
        page: '1',
      };
      const wrapper = createWrapper(Main, localVue, options);

      expect(wrapper.vm.boardname).toEqual('test');
      expect(wrapper.vm.page).toEqual('1');
    });
  });

  describe('Behavorial tests', () => {
    test('should call BOARD_REQUEST correctly when mounted', async () => {
      options.data = function() {
        return {
          boardname: 'test',
          page: '1',
        };
      };
      storeMock.actions.BOARD_REQUEST.mockResolvedValue({ board: {}, page: {}, sections: [], threads: [] });
      createWrapper(Main, localVue, options);
      const requestCalls = storeMock.actions.BOARD_REQUEST.mock.calls;

      expect(requestCalls).toHaveLength(1);
      // check it sends the correct params, we dont need to mach the entire store (first param of BOARD_REQUEST)
      expect(requestCalls[0][1]).toMatchObject({ boardname: 'test', page: '1' });
    });

    test('should call BOARD_REQUEST when route changes', async () => {
      delete options.mocks.$route;
      const router = new VueRouter({ routes: [{ path: '/:boardname/:page' }] });
      options.router = router;
      localVue.use(VueRouter);
      const wrapper = createWrapper(Main, localVue, options);

      router.push('/test/1');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.boardname).toEqual('test');
      expect(wrapper.vm.page).toEqual('1');
      expect(storeMock.actions.BOARD_REQUEST).nthCalledWith(2, expect.anything(), { boardname: 'test', page: '1' });
    });

    test('should show board header and board view when isBoardLoaded is true', async () => {
      storeMock.getters.isBoardLoaded = () => true;
      options.store = new Vuex.Store(storeMock);
      const wrapper = createWrapper(Main, localVue, options);
      const boardHeader = wrapper.find('.board-header');
      expect(boardHeader.exists()).toBeTruthy();
    });

    test('should show Loading component when isBoardLoaded is false', async () => {
      storeMock.getters.isBoardLoaded = () => false;
      options.store = new Vuex.Store(storeMock);
      const wrapper = createWrapper(Main, localVue, options);
      const loading = wrapper.findAllComponents(Loading);
      expect(loading).toHaveLength(1);
      expect(loading.at(0).exists()).toBeTruthy();
    });
  });
});
