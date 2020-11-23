/* eslint-disable no-param-reassign */
const { pick } = require('lodash');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
// const boardService = require('./board.service');
const { getQueryOptions } = require('../utils/service.util');
const { Post, Thread, Reply } = require('../models');
const AppError = require('../utils/AppError');
// const Logger = require('../config/logger');

const getPosts = async query => {
  const filter = pick(query, ['board', 'kind', 'stickied', 'locked']);
  const options = getQueryOptions(query);
  const posts = await Post.find(filter, null, options);
  return posts;
};

const getThreads = async (board, query) => {
  const options = getQueryOptions(query);
  const threads = await Thread.find({ board, deleted: false }, null, options);
  return Promise.all(
    threads.map(async thread => {
      const parsedThread = thread.transform();
      const replies = await thread.getReplies();
      return Object.assign(parsedThread, { replies });
    })
  );
};

const getThreadById = async id => {
  const thread = await Thread.findById(id);
  if (!thread) throw new AppError(httpStatus.NOT_FOUND, 'Thread not found');
  return thread;
};

const getThread = async (board, _id, addReplies = true) => {
  const thread = await Thread.findOne({ seq_id: _id, board, deleted: false });
  let replies = [];

  if (!thread) throw new AppError(httpStatus.NOT_FOUND, 'Thread not found');

  if (addReplies) replies = await thread.getReplies();

  return Object.assign(thread.transform(), { replies });
};

const createThread = async (board, threadBody) => {
  if (board.locked) throw new AppError(httpStatus.FORBIDDEN, 'The board is closed');
  const cryptedData = {
    ip: threadBody.ip,
    board,
  };
  const thread = new Thread(Object.assign(threadBody, cryptedData));
  await thread.save();
  return thread.transform();
};

const createReply = async (board, thread, replyBody) => {
  if (board.locked) throw new AppError(httpStatus.FORBIDDEN, 'The board is closed');
  const parsedData = {
    ip: replyBody.ip,
    board,
    thread,
  };
  const reply = new Reply(Object.assign(replyBody, parsedData));
  await reply.save();
  thread.lastbump = Date.now();
  await thread.save();
  return reply.transform();
};

const deleteThread = async (threadid, ip) => {
  const thread = await Thread.findById(threadid);
  if (!thread) throw new AppError(httpStatus.NOT_FOUND, 'Thread not found');
  if (ip !== thread.ip) throw new AppError(httpStatus.FORBIDDEN, `No puedes borrar este post`);
  await thread.delete();
  return thread;
};

const deleteReply = async (replyid, ip) => {
  const reply = await Reply.findById(replyid);
  if (!reply) throw new AppError(httpStatus.NOT_FOUND, 'Reply not found');
  if (ip !== reply.ip) throw new AppError(httpStatus.FORBIDDEN, `No puedes borrar este post`);
  await reply.delete();
  return reply;
};

const removePost = async postid => {
  const post = await Post.findById(postid);
  if (!post) throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  await post.remove();
  return post;
};

module.exports = {
  getPosts,
  getThreadById,
  getThread,
  getThreads,
  createThread,
  createReply,
  deleteThread,
  deleteReply,
  removePost,
};
