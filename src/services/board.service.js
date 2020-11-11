const { pick } = require('lodash');
const httpStatus = require('http-status');
const { Board } = require('../models');
const AppError = require('../utils/AppError');
const { getSectionsWithBoards } = require('../utils/service.util');
const { getQueryOptions } = require('../utils/service.util');

const getBoards = async query => {
  const filter = pick(query, ['name', 'section', 'locked', 'screened']);
  const options = getQueryOptions(query);
  const boards = await Board.find(filter, null, options);
  return boards;
};

const createBoard = async body => {
  const data = pick(body, [
    'name',
    'desc',
    'anonymous',
    'locked',
    'screened',
    'maxreplies',
    'postperpage',
    'section',
    'nsfw',
    'flag',
  ]);
  const board = await Board.create(data);
  return board;
};

const getBoardById = async boardId => {
  const board = await Board.findById(boardId);
  if (!board) {
    throw new AppError(httpStatus.NOT_FOUND, 'Board not found');
  }
  return board;
};

const updateBoard = async (boardId, updateBody) => {
  const board = await getBoardById(boardId);
  Object.assign(board, updateBody);
  await board.save();
  return board;
};

const deleteBoard = async boardId => {
  const board = await getBoardById(boardId);
  await board.remove();
  return board;
};

const getBoard = async name => {
  const board = await Board.findOne({ name });
  if (!board) {
    throw new AppError(httpStatus.NOT_FOUND, 'Board not found');
  }
  return board;
};

const getSections = async () => {
  const boards = await Board.find({});
  const boardnames = boards.map(board => board.pick(['name', 'desc', 'section', 'flag', 'nsfw']));
  return getSectionsWithBoards(boardnames);
};

module.exports = {
  getBoards,
  getBoard,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  getSections,
};
