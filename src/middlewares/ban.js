const Ban = require('../models/ban.model');
const AppError = require('../utils/AppError');

const verifyBan = async (req, resolve, reject) => {
  const ban = await Ban.findOne({ ip: req.ip });
  if (ban) reject(new AppError(400, 'You are banned!'));
  resolve();
};

const check = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    verifyBan(req, resolve, reject);
  })
    .then(() => next())
    .catch(err => next(err));
};

module.exports = {
  check,
};
