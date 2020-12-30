import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import StaffList from '@/app/components/panel/pages/staff/staff-list.vue';
import { getStaffList, deleteStaff } from '@/app/requests/staff';
import storeFixtures from '../../../../fixtures/store.fixture';
import staffFixtures from '../../../../fixtures/user.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/staff');

describe('staff-list.vue', () => {
  let wrapper;

  beforeEach(() => {
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
        wrapper = storeFixtures.createWrapper(StaffList, localVue);
        getStaffList.mockResolvedValue([staffFixtures.userOne, staffFixtures.userTwo]);
        await wrapper.vm.getUsers();
        expect(getStaffList).toBeCalledWith('some token here');
        expect(wrapper.vm.users).toEqual([staffFixtures.userOne, staffFixtures.userTwo]);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.getStaffList() fails', async () => {
        wrapper = storeFixtures.createWrapper(StaffList, localVue);
        getStaffList.mockRejectedValue(new Error('some error'));
        await wrapper.vm.getUsers();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('deleteStaff() method', () => {
      test('should call Request.deleteStaff() correctly', async () => {
        wrapper = storeFixtures.createWrapper(StaffList, localVue);
        await wrapper.vm.deleteUser(staffFixtures.userOne);
        expect(deleteStaff).toBeCalledWith('some token here', staffFixtures.userOne);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should change status to error and set errorMsg if Request.deleteStaff() fails', async () => {
        wrapper = storeFixtures.createWrapper(StaffList, localVue);
        deleteStaff.mockRejectedValue(new Error('some error'));
        await wrapper.vm.deleteUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });
});
