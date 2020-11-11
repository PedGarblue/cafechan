const { ObjectId } = require('mongoose').Types;

const boardOne = {
  _id: ObjectId().toHexString(),
  name: 'tst',
  desc: 'test board',
  section: 'ocio',
};

const boardTwo = {
  _id: ObjectId().toHexString(),
  name: 'pol',
  desc: 'Politica',
  section: 'ocio',
};

module.exports = {
  boardOne,
  boardTwo,
};
