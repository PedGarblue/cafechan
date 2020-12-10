import Router from 'vue-router';
import { AUTH_LOGOUT } from '../store/actions/auth';
import store from '../store';
import Roles from '../config/roles';
import Login from '../components/login';
import Home from '../components/home';
import PageNotFound from '../components/lib/404';
import Posts from '../components/posts';
import Staff from '../components/staff';
import StaffList from '../components/staff/staff-list';
import StaffAdd from '../components/staff/staff-add';
import StaffEdit from '../components/staff/staff-edit';
import BoardAdmin from '../components/board';
import BoardList from '../components/board/board-list';
import BoardAdd from '../components/board/board-add';
import BoardEdit from '../components/board/board-edit';
import Ban from '../components/bans';
import BanList from '../components/bans/ban-list';
import BanAdd from '../components/bans/ban-add';

const router = new Router({
  mode: 'history',
  base: '/panel/',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      meta: { authorize: [] },
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: { allowUnauthenticated: true },
    },
    {
      name: 'recent-posts',
      path: '/posts',
      component: Posts,
      meta: { authorize: [Roles.admin, Roles.modplus, Roles.mod] },
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize, allowUnauthenticated } = to.meta;
  const currentUser = store.getters.getProfile;
  const { isAuthenticated } = store.getters;
  if (!isAuthenticated && !allowUnauthenticated) {
    // not logged in so redirect to login page with the return url
    return next({ path: '/login' });
  }
  if (authorize) {
    // check if route is restricted by role
    if (authorize.length && !authorize.includes(currentUser.role)) {
      // role not authorised so redirect to home page
      console.log('si', currentUser);
      return next({ path: '/' });
    }
  }
  return next();
});

export default router;
