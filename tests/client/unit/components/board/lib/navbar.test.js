import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Navbar from '@/app/components/board/lib/navbar.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Navbar component', () => {
  describe('implementation tests', () => {
    test('should initialize with correct elements', () => {
      const propsData = {
        sections: [
          {
            name: 'ocio',
            boards: [{ board: 'test', desc: 'testing' }],
          },
          {
            name: 'intereses',
            boards: [{ board: 'test', desc: 'testing' }],
          },
          {
            name: 'regional',
            boards: [{ board: 'test', desc: 'testing' }],
          },
        ],
      };
      const wrapper = createWrapper(Navbar, localVue, { state: new Vuex.Store(storeMock), propsData });
      const sections = wrapper.findAll('.section');
      expect(sections).toHaveLength(4);
      const boards = wrapper.findAll('.board');
      expect(boards).toHaveLength(3);
    });
  });
});
