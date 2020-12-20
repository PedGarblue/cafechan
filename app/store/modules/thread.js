/* eslint-disable no-param-reassign */
import { THREAD_REQUEST, THREAD_SUCCESS, THREAD_ERROR } from '@/store/actions/thread';
import { getThread } from '@/requests/post';

const state = {
  status: '',
  thread: [],
};

const getters = {
  getThread: state => state.threads,
  isThreadLoaded: state => !!state.board.id && state.status === 'SUCCESS',
};

const actions = {
  [THREAD_REQUEST]: ({ commit, state }, threadid) => {
    return new Promise((resolve, reject) => {
      const boardname = state.board.name;
      commit(THREAD_REQUEST);
      getThread(boardname, threadid)
        .then(data => {
          commit(THREAD_SUCCESS, data);
          resolve(data);
        })
        .catch(error => {
          commit(THREAD_ERROR);
          reject(error);
        });
    });
  },
};

const mutations = {
  [THREAD_REQUEST]: state => {
    state.status = 'LOADING';
  },
  [THREAD_SUCCESS]: (state, thread) => {
    state.status = 'SUCCESS';
    state.thread = thread;
  },
  [THREAD_ERROR]: state => {
    state.status = 'ERROR';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
