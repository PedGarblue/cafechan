const catchAsync = require('../utils/catchAsync');

const getPanel = catchAsync(async (req, res) => {
  res.render('panel', {});
});

module.exports = { getPanel };
