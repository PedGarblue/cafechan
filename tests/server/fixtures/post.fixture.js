const faker = require('faker');
const mongoose = require('mongoose');
const { boardOne } = require('./board.fixture');
const { Thread, Reply } = require('../../../src/models');

const threadOne = {
  _id: mongoose.Types.ObjectId(),
  board: boardOne._id,
  title: faker.lorem.words(5),
  message: faker.lorem.paragraph(),
  timestamp: Date.now() - 180000,
  lastbump: Date.now() - 180000,
};

const threadTwo = {
  _id: mongoose.Types.ObjectId(),
  board: boardOne._id,
  title: faker.lorem.words(5),
  message: faker.lorem.paragraph(),
  timestamp: Date.now() - 100000,
  lastbump: Date.now() - 100000,
};

const replyOne = {
  _id: mongoose.Types.ObjectId(),
  board: boardOne._id,
  thread: threadOne._id,
  message: faker.lorem.paragraph(),
  timestamp: Date.now() - 80000,
};

const replyTwo = {
  _id: mongoose.Types.ObjectId(),
  board: boardOne._id,
  thread: threadOne._id,
  message: faker.lorem.paragraph(),
  timestamp: Date.now() - 40000,
};

const createThread = async (thread = threadOne) => {
  return Thread.create(thread);
};

const insertThreads = async threads => {
  return Thread.insertMany(threads);
};

const createReply = async (reply = replyOne) => {
  return Reply.create(reply);
};

const insertReplies = async replies => {
  return Reply.insertMany(replies);
};

module.exports = {
  threadOne,
  threadTwo,
  replyOne,
  replyTwo,
  createThread,
  insertThreads,
  createReply,
  insertReplies,
};
