import request from '@/request';
import store from '../store';

export const getBoards = () => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: '/board/?sortBy=name:desc', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getBoard = board => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/board/${board.id}`, method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const createBoard = board => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/board/`, method: 'POST', data: board, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const editBoard = (id, data) => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/board/${id}`, method: 'PATCH', data, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const deleteBoard = board => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/board/${board.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};
