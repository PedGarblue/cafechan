import Router from 'vue-router';

import Board from '@/components/board';
import Main from '@/components/board/pages/main';
import Thread from '@/components/board/pages/thread';
import PageNotFound from '@/components/lib/404';

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
