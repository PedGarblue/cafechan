const mongoose = require('mongoose');
const faker = require('faker');

const userOne = {
  _id: mongoose.Types.ObjectId().toHexString(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'guest',
};

const userTwo = {
  _id: mongoose.Types.ObjectId().toHexString(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'guest',
};

const admin = {
  _id: mongoose.Types.ObjectId().toHexString(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'admin',
};

module.exports = {
  userOne,
  userTwo,
  admin,
};
