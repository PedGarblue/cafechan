import faker from 'faker';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import StaffAdd from '@/app/components/panel/pages/staff/staff-add.vue';
import { createStaff } from '@/app/requests/staff';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/staff');

describe('staff-add.vue', () => {
  beforeEach(() => {
    createStaff.mockResolvedValue();
  });

  afterEach(() => {
    createStaff.mockClear();
  });

  describe('Implementation tests', () => {
    describe('createUser() method', () => {
      let newUser;
      let options;

      beforeEach(() => {
        newUser = {
          email: faker.internet.email(),
          name: faker.internet.userName(),
          role: 'admin',
          password: faker.internet.password(),
        };

        options = {
          store: new Vuex.Store(storeMock),
        };
      });

      test('should call Request.createStaff() correctly', async () => {
        const wrapper = createWrapper(StaffAdd, localVue, options);
        await wrapper.setData({ user: newUser });
        await wrapper.vm.createUser();
        expect(createStaff).toBeCalledWith('some token here', newUser);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.createStaff() fails', async () => {
        createStaff.mockRejectedValue(new Error('some error'));
        const wrapper = createWrapper(StaffAdd, localVue, options);
        await wrapper.setData({ user: newUser });
        await wrapper.vm.createUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });
});
