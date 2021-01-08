import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import NavbarMobile from '@/app/components/board/lib/navbar-mobile.vue';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('NavbarMobile.vue', () => {
  let options;

  beforeEach(() => {
    const propsData = {
      sections: [
        {
          name: 'ocio',
          boards: [{ board: 'test1', desc: 'testing1' }],
        },
        {
          name: 'intereses',
          boards: [{ board: 'test2', desc: 'testing2' }],
        },
        {
          name: 'regional',
          boards: [{ board: 'test3', desc: 'testing3' }],
        },
      ],
    };
    options = {
      propsData,
    };
  });

  test('initializes with correct elements', () => {
    const wrapper = createWrapper(NavbarMobile, localVue, options);
    const sections = wrapper.findAll('.section');
    expect(sections).toHaveLength(3);
    const boards = wrapper.findAll('.board');
    expect(boards).toHaveLength(3);
  });

  test('changeLocation method should redirect to the selected value', async () => {
    const wrapper = createWrapper(NavbarMobile, localVue, options);
    await wrapper.setData({ selected: 'test' });
    await wrapper.vm.changeLocation();
    expect(wrapper.vm.$router.push).toBeCalled();
  });
});
