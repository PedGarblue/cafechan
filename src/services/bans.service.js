/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { pick } = require('lodash');
const { Ban } = require('../models');
const { getQueryOptions } = require('../utils/service.util');
const AppError = require('../utils/AppError');

const getBans = async query => {
  const filter = pick(query, ['reason']);
  const options = getQueryOptions(query);
  const bans = await Ban.find(filter, null, options).or([{ until: { $gt: Date.now() }}, { until: { $eq: 0 } }]);
  return bans;
};

const addBan = async body => {
  const data = pick(body, ['ip', 'post', 'reason', 'until']);
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
