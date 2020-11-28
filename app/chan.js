/* eslint-disable no-unused-vars */
import Vue from 'vue';
import store from '@/store';
import postbox from '@/components/postBox';
import { POSTS_REQUEST } from '@/store/actions/posts';
import postsStyles from '../public/css/posts.css';

const app = new Vue({
  el: '#app',
  components: {
    postbox,
  },
  store,
});

app.$store.dispatch(POSTS_REQUEST);
