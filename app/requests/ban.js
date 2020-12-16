import request from '@/request';

export const getBans = accessToken => {
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  return new Promise((resolve, reject) => {
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
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  if (!ban || typeof ban !== 'object') throw new Error('Ban is not set');
  return new Promise((resolve, reject) => {
    request({ url: '/api/ban/', method: 'POST', data: ban, headers: { Authorization: `Bearer ${accessToken}` } })
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
};

export const deleteBan = (accessToken, ban) => {
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  if (!ban || typeof ban !== 'object') throw new Error('Ban is not set');
  return new Promise((resolve, reject) => {
    request({ url: `/api/ban/${ban.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => resolve())
      .catch(err => reject(err));
  });
};
