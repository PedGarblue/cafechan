import Roles from '@/app/config/roles';
import Ban from '@/app/components/panel/pages/bans';
import BanList from '@/app/components/panel/pages/bans/ban-list';
import BanAdd from '@/app/components/panel/pages/bans/ban-add';

export default {
  path: '/ban',
  component: Ban,
  meta: { authorize: [Roles.admin, Roles.modplus] },
  children: [
    {
      name: 'ban-view',
      path: '',
      component: BanList,
      meta: { authorize: [Roles.admin, Roles.modplus] },
    },
    {
      name: 'ban-add',
      path: 'add',
      component: BanAdd,
      meta: { authorize: [Roles.admin, Roles.modplus] },
    },
  ],
};
