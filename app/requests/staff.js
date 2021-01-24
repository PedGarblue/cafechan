import request from '@/app/request';

export const getStaffList = accessToken => {
  return new Promise((resolve, reject) => {
    if (!accessToken) reject(new Error('Access token is not set'));
    request({ url: '/api/user/?sortBy=role:desc', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getStaff = (accessToken, user) => {
  return new Promise((resolve, reject) => {
    if (!accessToken) reject(new Error('Access token is not set'));
    request({ url: `/api/user/${user.id}`, method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const createStaff = (accessToken, user) => {
  return new Promise((resolve, reject) => {
    if (!accessToken) reject(new Error('Access token is not set'));
    request({ url: '/api/user', method: 'POST', data: user, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const deleteStaff = (accessToken, user) => {
  return new Promise((resolve, reject) => {
    if (!accessToken) reject(new Error('Access token is not set'));
    request({ url: `/api/user/${user.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const editStaff = (accessToken, user) => {
  const data = {
    role: user.role,
  };

  return new Promise((resolve, reject) => {
    if (!accessToken) reject(new Error('Access token is not set'));
    request({ url: `/api/user/${user.id}`, method: 'PATCH', data, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};
