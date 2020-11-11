const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const banService = require('../services/bans.service');

const getBans = catchAsync(async (req, res) => {
  const bans = await banService.getBans(req.query);
  res.status(httpStatus.OK).send(bans);
});

const addBan = catchAsync(async (req, res) => {
  const ban = await banService.addBan(req.body);
  res.status(httpStatus.CREATED).send(ban);
});

const deleteBan = catchAsync(async (req, res) => {
  await banService.deleteBan(req.params.banId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getBans,
  addBan,
  deleteBan,
};
