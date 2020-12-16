const express = require('express');
const validate = require('../../middlewares/validate');
const boardValidation = require('../../validations/board.validation');
const boardController = require('../../controllers/board.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

// create and list boards
router
  .route('/')
  .get(auth('manageBoards'), validate(boardValidation.getBoards), boardController.getBoards)
  .post(auth('manageBoards'), validate(boardValidation.createBoard), boardController.createBoard);

// get, update and delete board
router
  .route('/:boardId')
  .get(auth('manageBoards'), validate(boardValidation.getBoard), boardController.getBoard)
  .delete(auth('manageBoards'), validate(boardValidation.deleteBoard), boardController.deleteBoard)
  .patch(auth('manageBoards'), validate(boardValidation.editBoard), boardController.updateBoard);

module.exports = router;
