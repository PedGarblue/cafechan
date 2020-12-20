/* eslint-disable no-param-reassign */
import request from '@/request';
import { BOARD_REQUEST, BOARD_SUCCESS, BOARD_ERROR } from '@/store/actions/board';

const state = {
  status: '',
  board: {},
  page: {},
  sections: [],
  threads: [],
};

const getters = {
  getBoard: state => state.board,
  getSections: state => state.sections,
  getThreads: state => state.threads,
  getPagination: state => state.page,
  isBoardLoaded: state => !!state.board.id && state.status === 'SUCCESS',
};

const actions = {
  [BOARD_REQUEST]: ({ commit }, { boardname, page = 1 }) => {
    return new Promise((resolve, reject) => {
      commit(BOARD_REQUEST);
      request({ url: `/${boardname}/${page}`, method: 'GET' })
        .then(data => {
          commit(BOARD_SUCCESS, data);
          resolve(data);
        })
        .catch(error => {
          commit(BOARD_ERROR);
          reject(error);
        });
    });
  },
};

const mutations = {
  [BOARD_REQUEST]: state => {
    state.status = 'LOADING';
  },
  [BOARD_SUCCESS]: (state, data) => {
    state.status = 'SUCCESS';
    state.board = data.board;
    state.page = data.page;
    state.sections = data.sections;
    state.threads = data.threads;
    state.hasLoadedOnce = true;
  },
  [BOARD_ERROR]: state => {
    state.status = 'ERROR';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
