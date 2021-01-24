import request from '@/app/request';
import { savePost } from '@/app/utils/myPosts';

export const getPosts = accessToken => {
  return new Promise((resolve, reject) => {
    if (!accessToken || typeof accessToken !== 'string') reject(new Error('Access token is not set'));
    request({
      url: '/api/posts/?sortBy=created_at:desc',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const removePost = (accessToken, post) => {
  return new Promise((resolve, reject) => {
    if (!accessToken || typeof accessToken !== 'string') reject(new Error('Access token is not set'));
    if (!post || typeof post !== 'object') reject(new Error('Post is not set'));
    request({ url: `/api/posts/${post.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getThread = (boardname, threadid) =>
  new Promise((resolve, reject) => {
    if (!boardname) reject(new Error('Boardname is not set'));
    if (!threadid) reject(new Error('Thread is not set'));
    const headers = {
      'Content-Type': 'application/json',
    };
    request({ url: `/${boardname}/thread/${threadid}/`, method: 'GET' }, headers)
      .then(data => resolve(data.thread))
      .catch(err => reject(err));
  });

export const sendPost = boardid => {
  const sendPostRequest = (url, data) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return request({ url, method: 'POST', data }, headers).then(resp => {
      savePost(resp);
      return resp;
    });
  };
  if (typeof boardid !== 'string') throw new Error('Invalid argument');
  let url = `/api/posts`;
  const data = new FormData();
  data.append('board', boardid);

  return {
    thread: post => {
      return new Promise((resolve, reject) => {
        if (!post.message) reject(new Error('To post a thread in this board you need a message'));
        data.append('title', post.title);
        data.append('message', post.message);
        if (post.file) data.append('postfile', post.file);
        url = `${url}/thread`;
        sendPostRequest(url, data)
          .then(thread => {
            resolve(thread);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    reply: (thread, { message, file }) =>
      new Promise((resolve, reject) => {
        if (!message) reject(new Error('To reply this thread you need a message'));
        data.append('thread', thread);
        data.append('message', message);
        if (file) data.append('postfile', file);
        url = `${url}/reply`;
        sendPostRequest(url, data)
          .then(reply => {
            resolve(reply);
          })
          .catch(err => {
            reject(err);
          });
      }),
  };
};
