import request from '@/app/request';

export const getBans = accessToken => {
  return new Promise((resolve, reject) => {
    if (!accessToken || typeof accessToken !== 'string') reject(new Error('Access token is not set'));
    request({ url: '/api/ban/', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const sendBan = (accessToken, ban) => {
  return new Promise((resolve, reject) => {
    if (!accessToken || typeof accessToken !== 'string') reject(new Error('Access token is not set'));
    if (!ban || typeof ban !== 'object') reject(new Error('Ban is not set'));
    request({ url: '/api/ban/', method: 'POST', data: ban, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
};

export const deleteBan = (accessToken, ban) => {
  return new Promise((resolve, reject) => {
    if (!accessToken || typeof accessToken !== 'string') reject(new Error('Access token is not set'));
    if (!ban || typeof ban !== 'object') reject(new Error('Ban is not set'));
    request({ url: `/api/ban/${ban.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => resolve())
      .catch(err => reject(err));
  });
};
