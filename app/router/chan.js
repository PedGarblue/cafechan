import Router from 'vue-router';

import Board from '@/app/components/board';
import Main from '@/app/components/board/pages/main';
import Thread from '@/app/components/board/pages/thread';
import PageNotFound from '@/app/components/lib/404';

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/:boardname/:page?',
      component: Board,
      children: [
        {
          path: '',
          component: Main,
        },
        {
          path: 'thread/:threadid',
          component: Thread,
        },
      ],
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ],
});

export default router;
