const mongoose = require('mongoose');
const { Board } = require('../../../src/models');

const boardOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'tst',
  desc: 'test board',
  section: 'ocio',
};

const boardTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'pol',
  desc: 'Politica',
  section: 'ocio',
};

const createBoard = async (board = boardOne) => Board.create(board);

const insertBoards = async boards => Board.insertMany(boards);

module.exports = {
  boardOne,
  boardTwo,
  createBoard,
  insertBoards,
};
