import Roles from '@/config/roles';
import BoardAdmin from '@/components/panel/pages/board';
import BoardList from '@/components/panel/pages/board/board-list';
import BoardAdd from '@/components/panel/pages/board/board-add';
import BoardEdit from '@/components/panel/pages/board/board-edit';

export default {
  path: '/board',
  component: BoardAdmin,
  meta: { authorize: [Roles.admin] },
  children: [
    {
      name: 'board-view',
      path: '',
      component: BoardList,
      meta: { authorize: [Roles.admin] },
    },
    {
      name: 'board-add',
      path: 'add',
      component: BoardAdd,
      meta: { authorize: [Roles.admin] },
    },
    {
      name: 'board-edit',
      path: 'edit/:boardId',
      component: BoardEdit,
      meta: { authorize: [Roles.admin] },
    },
  ],
};
