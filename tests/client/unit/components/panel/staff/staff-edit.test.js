import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import faker from 'faker';
import { pick } from 'lodash';


import StaffEdit from '@/app/components/panel/pages/staff/staff-edit.vue';
import { getStaff, editStaff } from '@/app/requests/staff';
import storeFixtures from '../../../../fixtures/store.fixture';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/app/requests/staff');

describe('board-edit.vue', () => {
  let wrapper;
  let newStaff;

  beforeEach(() => {
    newStaff = {
      id: 'some id here',
      role: 'admin',
      name: faker.internet.userName(),
      email: faker.internet.email(),
    };

    getStaff.mockResolvedValue();
    editStaff.mockResolvedValue();
  });

  afterEach(() => {
    getStaff.mockClear();
    editStaff.mockClear();
  });

  describe('Implementation tests', () => {
    describe('getUser() method', () => {
      test('should call Request.getStaff() correctly', async () => {
        const emptyStaff = {
          id: 'some id here',
          email: '',
          role: '',
          name: '',
        };
        const overrides = {
          data() {
            return {
              user: emptyStaff,
            };
          },
        };
        getStaff.mockResolvedValue(newStaff);
        wrapper = storeFixtures.createWrapper(StaffEdit, localVue, overrides);
        await wrapper.vm.getUser();
        expect(getStaff).toBeCalledWith('some token here', emptyStaff);
        expect(wrapper.vm.user).toEqual(newStaff);
        expect(wrapper.vm.status).toEqual('SUCCESS');
      });

      test('should set state to ERROR if Request.getBoard() fails', async () => {
        getStaff.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(StaffEdit, localVue);
        await wrapper.vm.getUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });

    describe('editBoard() method', () => {
      test('should call Request.editStaff correctly', async () => {
        wrapper = storeFixtures.createWrapper(StaffEdit, localVue);
        newStaff.role = 'mod';
        await wrapper.setData({
          user: newStaff,
        });
        await wrapper.vm.editUser();
        expect(editStaff).toBeCalledWith('some token here', pick(newStaff, ['id', 'role']));
        expect(wrapper.vm.status).toEqual('SUCCESS');
        expect(wrapper.vm.successEdit).toBeTruthy();
      });

      test('should set state to ERROR if Request.editBoard() fails', async () => {
        editStaff.mockRejectedValue(new Error('some error'));
        wrapper = storeFixtures.createWrapper(StaffEdit, localVue);
        await wrapper.vm.editUser();
        expect(wrapper.vm.status).toEqual('ERROR');
        expect(wrapper.vm.errorMsg).toEqual('some error');
      });
    });
  });
});
