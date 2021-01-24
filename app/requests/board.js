import request from '@/app/request';

export const getBoards = accessToken => {
  return new Promise((resolve, reject) => {
    if (accessToken === undefined) reject(new Error('Access token is not set'));
    request({ url: '/api/board/?sortBy=name:desc', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getBoard = (accessToken, board) => {
  return new Promise((resolve, reject) => {
    if (accessToken === undefined) reject(new Error('Access token is not set'));
    request({ url: `/api/board/${board.id}`, method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const createBoard = (accessToken, board) => {
  return new Promise((resolve, reject) => {
    if (accessToken === undefined) reject(new Error('Access token is not set'));
    request({ url: `/api/board/`, method: 'POST', data: board, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const editBoard = (accessToken, id, data) => {
  return new Promise((resolve, reject) => {
    if (accessToken === undefined) reject(new Error('Access token is not set'));
    request({ url: `/api/board/${id}`, method: 'PATCH', data, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const deleteBoard = (accessToken, board) => {
  return new Promise((resolve, reject) => {
    if (accessToken === undefined) reject(new Error('Access token is not set'));
    request({ url: `/api/board/${board.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};
