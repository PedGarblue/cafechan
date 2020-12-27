/* eslint-disable no-param-reassign */
import Vue from 'vue';
import request from '@/app/request';
import { USER_REQUEST, USER_ERROR, USER_SUCCESS, USER_LOGOUT } from '../actions/user';
import { AUTH_LOGOUT } from '../actions/auth';

const state = {
  status: '',
  profile: JSON.parse(sessionStorage.getItem('user')) || {},
  hasLoadedOnce: false,
};

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name && state.hasLoadedOnce,
  userStatus: state => state.status,
};

const actions = {
  [USER_REQUEST]: ({ state, commit, dispatch }, user = state.profile) => {
    commit(USER_REQUEST);

    return new Promise((resolve, reject) => {
      const accessToken = state.tokens.access.token;
      const userid = user.id || localStorage.getItem('user');

      request({ url: `/api/user/${userid}`, method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
        .then(user => {
          localStorage.setItem('user', user.id);
          sessionStorage.setItem('user', JSON.stringify(user));
          commit(USER_SUCCESS, user);
          resolve(user);
        })
        .catch(err => {
          commit(USER_LOGOUT);
          commit(USER_ERROR);
          dispatch(AUTH_LOGOUT);
          reject(err);
        });
    });
  },
  [USER_LOGOUT]: ({ commit }) => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    commit(USER_LOGOUT);
  },
};

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading';
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.hasLoadedOnce = true;
    Vue.set(state, 'profile', resp);
  },
  [USER_ERROR]: state => {
    state.status = 'error';
  },
  [USER_LOGOUT]: state => {
    state.profile = {};
    state.status = '';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
