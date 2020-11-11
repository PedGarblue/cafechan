const { ObjectId } = require('mongoose').Types;
const faker = require('faker');
const { formatTimestamp } = require('../../../src/utils/date.util');
const { boardOne } = require('./board.fixture');

export const threadOne = {
  __v: 0,
  _id: ObjectId().toHexString(),
  id: ObjectId().toHexString(),
  board: boardOne._id,
  created_at: Date.now() - 20000,
  timestamp: formatTimestamp(Date.now() - 20000),
  deleted: false,
  seq_id: 100,
  kind: 'Thread',
  name: 'Anonymous',
  title: faker.lorem.words(4),
  message: faker.lorem.paragraph(),
};

export const threadTwo = {
  __v: 0,
  _id: ObjectId().toHexString(),
  id: ObjectId().toHexString(),
  board: boardOne._id,
  created_at: Date.now() - 10000,
  timestamp: formatTimestamp(Date.now() - 10000),
  deleted: false,
  seq_id: 101,
  kind: 'Thread',
  name: 'Anonymous',
  title: faker.lorem.words(4),
  message: faker.lorem.paragraph(),
};

export const replyOne = {
  __v: 0,
  _id: ObjectId().toHexString(),
  id: ObjectId().toHexString(),
  board: boardOne._id,
  thread: threadOne.id,
  timestamp: formatTimestamp(Date.now() - 9000),
  created_at: Date.now() - 9000,
  deleted: false,
  seq_id: 102,
  kind: 'Reply',
  name: 'Anonymous',
  message: faker.lorem.paragraph(),
};

export const replyTwo = {
  __v: 0,
  _id: ObjectId().toHexString(),
  id: ObjectId().toHexString(),
  board: boardOne._id,
  thread: threadOne.id,
  timestamp: formatTimestamp(Date.now() - 7000),
  created_at: Date.now() - 7000,
  deleted: false,
  seq_id: 103,
  kind: 'Reply',
  name: 'Anonymous',
  message: faker.lorem.paragraph(),
};
