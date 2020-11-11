/* eslint-disable no-param-reassign */
import getThreads from '@/utils/postsDomFetching';
import { POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR } from '../actions/posts';

const FIRST_INDEX = 0;

const state = {
  posts: [],
  status: '',
  hasLoadedOnce: false,
};

const getters = {
  hasPostsLoaded: state => state.posts.length > 0,
  postsState: state => state.status,
  thread: state => state.posts[FIRST_INDEX],
  threads: state => state.posts,
};

const actions = {
  async [POSTS_REQUEST]({ commit }) {
    return new Promise((resolve, reject) => {
      commit(POSTS_REQUEST);
      getThreads()
        .then(posts => {
          commit(POSTS_SUCCESS, posts);
          resolve(posts);
        })
        .catch(err => {
          commit(POSTS_ERROR, err);
          reject(err);
        });
    });
  },
};

const mutations = {
  [POSTS_REQUEST]: state => {
    state.status = 'loading';
  },
  [POSTS_SUCCESS]: (state, posts) => {
    state.posts = posts;
    state.status = 'success';
    state.hasLoadedOnce = true;
  },
  [POSTS_ERROR]: state => {
    state.status = 'error';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
