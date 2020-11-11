import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import router from './router';
import Panel from './components/panel';

Vue.use(VueRouter);

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#panelapp',
  components: {
    'staff-panel': Panel,
  },
  router,
  store,
});
