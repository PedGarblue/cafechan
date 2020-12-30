import faker from 'faker';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import StaffAdd from '@/app/components/panel/pages/staff/staff-add.vue';
import { createStaff } from '@/app/requests/staff';
import storeFixtures from '../../../../fixtures/store.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/staff');

describe('staff-add.vue', () => {
  let wrapper;

  beforeEach(() => {
    createStaff.mockResolvedValue();
  });

  afterEach(() => {
    createStaff.mockClear();
  });

  describe('Implementation tests', () => {
    describe('createUser() method', () => {
      let newUser;

      beforeEach(() => {
        newUser = {
          email: faker.internet.email(),
          name: faker.internet.userName(),
          role: 'admin',
          password: faker.internet.password(),
        };
      });

      test('should call Request.createStaff() correctly', async () => {
        wrapper = storeFixtures.createWrapper(StaffAdd, localVue);
        await wrapper.setData({ user: newUser });
        await wrapper.vm.createUser();
        expect(createStaff).toBeCalledWith('some token here', newUser);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.createStaff() fails', async () => {
        createStaff.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(StaffAdd, localVue);
        await wrapper.setData({ user: newUser });
        await wrapper.vm.createUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });
});
