import request from '@/app/request';
import store from '@/app/store/panel';

export const getStaffList = () => {
  return new Promise((resolve, reject) => {
    const accessToken = store.getters.accessToken.token;
    request({ url: '/api/user/?sortBy=role:desc', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getStaff = user => {
  const accessToken = store.getters.accessToken.token;
  return new Promise((resolve, reject) => {
    request({ url: `/api/user/${user.id}`, method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const createStaff = user => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/api/user/`, method: 'POST', data: user, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const deleteStaff = user => {
  const accessToken = store.getters.accessToken.token;

  return new Promise((resolve, reject) => {
    request({ url: `/api/user/${user.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const editStaff = user => {
  const accessToken = store.getters.accessToken.token;
  const data = {
    role: user.role,
  };

  return new Promise((resolve, reject) => {
    request({ url: `/api/user/${user.id}`, method: 'PATCH', data, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};
