import request from '@/request';
import { savePost } from '@/utils/myPosts';

export const getPosts = accessToken => {
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  return new Promise((resolve, reject) => {
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
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  if (!post || typeof post !== 'object') throw new Error('Post is not set');
  return new Promise((resolve, reject) => {
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
    const headers = {
      'Content-Type': 'application/json',
    };
    request({ url: `/${boardname}/thread/${threadid}/`, method: 'GET' }, headers)
      .then(data => resolve(data.thread))
      .catch(err => reject(err));
  });

export const sendPost = boardid => {
  if (!boardid || typeof boardid !== 'string') throw new Error('Invalid argument');
  const sendPostPromise = (url, data) =>
    new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      request({ url, method: 'POST', data }, headers)
        .then(resp => {
          savePost(resp);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  let url = `/api/posts`;
  const data = new FormData();
  data.append('board', boardid);

  return {
    thread: post => {
      if (!post.message) throw new Error('To post a thread in this board you need a message');
      data.append('title', post.title);
      data.append('message', post.message);
      if (post.file) data.append('postfile', post.file);
      url = `${url}/thread`;
      return sendPostPromise(url, data);
    },
    reply: (thread, post) => {
      if (!post.message) throw new Error('To reply this thread you need a message');
      data.append('thread', thread);
      data.append('message', post.message);
      if (post.file) data.append('postfile', post.file);
      url = `${url}/reply`;
      return sendPostPromise(url, data);
    },
  };
};
