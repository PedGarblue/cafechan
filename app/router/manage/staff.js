import Roles from '@/config/roles';
import Staff from '@/components/panel/pages/staff';
import StaffList from '@/components/panel/pages/staff/staff-list';
import StaffAdd from '@/components/panel/pages/staff/staff-add';
import StaffEdit from '@/components/panel/pages/staff/staff-edit';

export default {
  path: '/staff',
  component: Staff,
  meta: { authorize: [Roles.admin] },
  children: [
    {
      name: 'staff-view',
      path: '',
      component: StaffList,
      meta: { authorize: [Roles.admin] },
    },
    {
      name: 'staff-add',
      path: 'add',
      component: StaffAdd,
      meta: { authorize: [Roles.admin] },
    },
    {
      name: 'staff-edit',
      path: 'edit/:userId',
      component: StaffEdit,
      meta: { authorize: [Roles.admin] },
    },
  ],
};
