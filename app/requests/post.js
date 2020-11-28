import request from '@/request';
import { savePost } from '../utils/myPosts';

export const getPosts = accessToken => {
  if (!accessToken || typeof accessToken !== 'string') throw new Error('Access token is not set');
  return new Promise((resolve, reject) => {
    request({ url: '/posts/?sortBy=created_at:desc', method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } })
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
    request({ url: `/posts/${post.id}`, method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const sendPost = (boardname, boardid) => {
  if (!boardname || !boardid || typeof boardname !== 'string' || typeof boardid !== 'string')
    throw new Error('Invalid argument');
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
  let url = `/${boardname}/`;
  const data = new FormData();
  data.append('board', boardid);

  return {
    thread: (title, message, postfile) => {
      if (!message) throw new Error('To post a thread in this board you need a message');
      data.append('title', title);
      data.append('message', message);
      if (postfile) data.append('postfile', postfile);
      return sendPostPromise(url, data);
    },
    reply: (thread, threadseqid, message, postfile) => {
      if (!message) throw new Error('To reply this thread you need a message');
      data.append('thread', thread);
      data.append('message', message);
      if (postfile) data.append('postfile', postfile);
      url = `${url}thread/${threadseqid}/`;
      return sendPostPromise(url, data);
    },
  };
};
