import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import StaffList from '@/app/components/panel/pages/staff/staff-list.vue';
import { getStaffList, deleteStaff } from '@/app/requests/staff';
import storeMock from '@/tests/client/fixtures/panel.store.fixture';
import createWrapper from '@/tests/client/fixtures/wrapper';
import { userOne, userTwo } from '@/tests/client/fixtures/user.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/staff');

describe('staff-list.vue', () => {
  let options;

  beforeEach(() => {
    options = {
      store: new Vuex.Store(storeMock),
    };
    getStaffList.mockResolvedValue();
    deleteStaff.mockResolvedValue();
  });

  afterEach(() => {
    getStaffList.mockClear();
    deleteStaff.mockClear();
  });

  describe('Implementation tests', () => {
    describe('getStaffList() method', () => {
      test('should call Request.getStaffList() correctly', async () => {
        const wrapper = createWrapper(StaffList, localVue, options);
        getStaffList.mockResolvedValue([userOne, userTwo]);
        await wrapper.vm.getUsers();
        expect(getStaffList).toBeCalledWith('some token here');
        expect(wrapper.vm.users).toEqual([userOne, userTwo]);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.getStaffList() fails', async () => {
        const wrapper = createWrapper(StaffList, localVue, options);
        getStaffList.mockRejectedValue(new Error('some error'));
        await wrapper.vm.getUsers();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('deleteStaff() method', () => {
      test('should call Request.deleteStaff() correctly', async () => {
        const wrapper = createWrapper(StaffList, localVue, options);
        await wrapper.vm.deleteUser(userOne);
        expect(deleteStaff).toBeCalledWith('some token here', userOne);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.deleteStaff() fails', async () => {
        const wrapper = createWrapper(StaffList, localVue, options);
        deleteStaff.mockRejectedValue(new Error('some error'));
        await wrapper.vm.deleteUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });
});
