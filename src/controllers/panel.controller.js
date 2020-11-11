const path = require('path');
const catchAsync = require('../utils/catchAsync');

const getPanel = catchAsync(async (req, res) => {
  res.sendFile(path.join(`${__dirname}/../views/panel/index.html`));
});

module.exports = { getPanel };
