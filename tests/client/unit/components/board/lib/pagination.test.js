import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Pagination from '@/app/components/board/lib/pagination.vue';
import storeMock from '@/tests/client/fixtures/board.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Pagination component', () => {
  let options;

  const propsData = {
    actualPage: 1,
    totalPages: 10,
  };
  beforeEach(() => {
    options = {
      propsData,
      store: new Vuex.Store(storeMock),
    };
  });

  describe('implementation tests', () => {
    test('initializes with correct elements', () => {
      const wrapper = createWrapper(Pagination, localVue, options);
      const pagItems = wrapper.findAll('.pag-item');
      expect(pagItems).toHaveLength(12);
    });
  });

  describe('behavorial tests', () => {
    test('should disable previous button if is in the first page', () => {
      options.propsData.actualPage = 1;
      const wrapper = createWrapper(Pagination, localVue, options);
      const pagItems = wrapper.findAll('.pag-item');
      expect(pagItems.at(0).classes()).toContain('disabled');
    });

    test('should disable actual page button', () => {
      options.propsData.actualPage = 5;
      const wrapper = createWrapper(Pagination, localVue, options);
      const pagItems = wrapper.findAll('.pag-item');
      expect(pagItems.at(5).classes()).toContain('disabled');
    });

    test('should disable next button if is in the last page', () => {
      options.propsData.actualPage = 10;
      const wrapper = createWrapper(Pagination, localVue, options);
      const pagItems = wrapper.findAll('.pag-item');
      expect(pagItems.at(pagItems.length - 1).classes()).toContain('disabled');
    });
  });
});
