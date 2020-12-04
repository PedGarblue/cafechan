/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { pick } = require('lodash');

const { decrypt } = require('../utils/crypt');
const { Ban } = require('../models');
const { getQueryOptions } = require('../utils/service.util');
const Post = require('../models/post.model');
const AppError = require('../utils/AppError');

const getBans = async query => {
  const filter = pick(query, ['reason']);
  const options = getQueryOptions(query);
  const bans = await Ban.find(filter, null, options).or([{ until: { $gt: Date.now() } }, { until: { $eq: 0 } }]);
  return bans;
};

const addBan = async body => {
  const data = pick(body, ['ip', 'post', 'reason', 'until']);
  if (data.post) {
    const post = await Post.findById(data.post);
    if (!post) throw new AppError(httpStatus.BAD_REQUEST, "Post doesn't exists");
    data.ip = decrypt(post.ip);
  }
  const ban = await Ban.create(data);
  return ban;
};

const deleteBan = async banId => {
  const ban = await Ban.findByIdAndDelete(banId);
  if (!ban) throw new AppError(httpStatus.NOT_FOUND, 'Ban not found');
  return ban;
};

module.exports = {
  getBans,
  addBan,
  deleteBan,
};
