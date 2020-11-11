const faker = require('faker');
const { Types } = require('mongoose');
const { replyOne, replyTwo } = require('./post.fixture');
const banTimes = require('../../../src/config/banTimes');
const { Ban } = require('../../../src/models');

const banOne = {
  _id: Types.ObjectId(),
  ip: faker.internet.ip(),
  post: replyOne._id,
  reason: 'Shitposting',
  until: banTimes.week(),
};

const banTwo = {
  _id: Types.ObjectId(),
  ip: faker.internet.ip(),
  post: replyTwo._id,
  reason: 'Shitposting',
  until: banTimes.permaban(),
};

const createBan = async (ban = banOne) => {
  return Ban.create(ban);
};

const insertBans = async bans => {
  await Ban.insertMany(bans);
};

module.exports = {
  banOne,
  banTwo,
  insertBans,
  createBan,
};
