const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { boardService } = require('../services');

const frontPage = catchAsync(async (req, res) => {
  const sections = await boardService.getSections();
  const data = {
    sections,
  };
  res.status(httpStatus.OK).render('frontpage', data);
});

module.exports = {
  frontPage,
};
