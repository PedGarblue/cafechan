import Router from 'vue-router';

import store from '@/app/store/panel';
import Roles from '@/app/config/roles';
import Login from '@/app/components/panel/pages/login';
import Home from '@/app/components/panel/pages/home';
import Posts from '@/app/components/panel/pages/posts';
import PageNotFound from '@/app/components/lib/404';
import BoardRoutes from './manage/board';
import StaffRoutes from './manage/staff';
import BansRoutes from './manage/bans';

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
    BoardRoutes,
    StaffRoutes,
    BansRoutes,
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
      return next({ path: '/' });
    }
  }
  return next();
});

export default router;
