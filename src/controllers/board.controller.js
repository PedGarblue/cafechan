const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { boardService } = require('../services');

const getBoard = catchAsync(async (req, res) => {
  const board = await boardService.getBoardById(req.params.boardId);
  res.json(board.transform());
});

const getBoards = catchAsync(async (req, res) => {
  const boards = await boardService.getBoards(req.query);
  const response = boards.map(board => board.transform());
  res.json(response);
});

const createBoard = catchAsync(async (req, res) => {
  const board = await boardService.createBoard(req.body);
  res.status(httpStatus.CREATED).json(board.transform());
});

const updateBoard = catchAsync(async (req, res) => {
  const board = await boardService.updateBoard(req.params.boardId, req.body);
  res.json(board.transform());
});

const deleteBoard = catchAsync(async (req, res) => {
  await boardService.deleteBoard(req.params.boardId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
