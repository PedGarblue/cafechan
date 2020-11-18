import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Bans from '../../../../../app/components/bans/index.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('index.vue Implementation test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Bans, { localVue, router });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test('initializes with the correct elements', () => {
    expect(wrapper.findAll('.staff-container').length).toBe(1);
  });
});
