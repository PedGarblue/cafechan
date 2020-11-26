const httpStatus = require('http-status');
const { Board } = require('../models');
const AppError = require('../utils/AppError');

const fileValidation = async req => {
  const board = await Board.findById(req.body.board);
  return new Promise((resolve, reject) => {
    if (req.files.postfile.size > board.maxfilesize) reject(new AppError(httpStatus.BAD_REQUEST, 'Your file is too big'));
    if (!board.allowedfiletypes.includes(req.files.postfile.mimetype))
      reject(new AppError(httpStatus.BAD_REQUEST, 'Not allowed file type'));
    resolve();
  });
};

const validate = (req, res, next) => {
  if (req.files) {
    return fileValidation(req)
      .then(() => next())
      .catch(err => next(err));
  }
  return next();
};
module.exports = validate;
