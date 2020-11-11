const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');
const banReasons = require('../config/banReasons');

const getBans = {
  query: Joi.object().keys({
    reason: Joi.string().valid(...banReasons),
    expired: Joi.boolean(),
  }),
};

const deleteBan = {
  params: Joi.object().keys({
    banId: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const addBan = {
  body: Joi.object().keys({
    ip: Joi.string()
      .ip()
      .required(),
    post: Joi.string().custom(objectId),
    reason: Joi.string()
      .valid(...banReasons)
      .required(),
    until: Joi.number().required(),
  }),
};

module.exports = {
  getBans,
  addBan,
  deleteBan,
};
