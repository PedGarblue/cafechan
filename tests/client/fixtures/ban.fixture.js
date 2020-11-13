const { Types } = require('mongoose');
const faker = require('faker');
const banTimes = require('../../../src/config/banTimes');

const banOne = {
  _id: Types.ObjectId().toHexString(),
  ip: faker.internet.ip(),
  reason: 'Shitposting',
  until: banTimes.hour(),
};

const banTwo = {
  _id: Types.ObjectId().toHexString(),
  ip: faker.internet.ip(),
  reason: 'Shitposting',
  until: banTimes.hour(),
};

module.exports = {
  banOne,
  banTwo,
};
