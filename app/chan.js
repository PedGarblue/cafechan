/* eslint-disable no-unused-vars */
import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store/chan';
import router from './router/chan';

Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  router,
  store,
});
