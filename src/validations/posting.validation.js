const Joi = require('@hapi/joi');
const appConfig = require('../config/appConfig');
const { objectId } = require('./custom.validation');

const getPosts = {
  query: Joi.object().keys({
    board: Joi.string(),
    kind: Joi.string().valid('Reply', 'Thread'),
    stickied: Joi.boolean(),
    moved: Joi.boolean(),
    sortBy: Joi.string(),
  }),
};

const thread = {
  body: Joi.object().keys({
    board: Joi.string()
      .custom(objectId)
      .required(),
    title: Joi.string()
      .max(appConfig.posting.title.maxChars)
      .required(),
    message: Joi.string().max(appConfig.posting.message.maxChars),
  }),
};

const reply = {
  body: Joi.object().keys({
    board: Joi.string()
      .custom(objectId)
      .required(),
    thread: Joi.string()
      .custom(objectId)
      .required(),
    message: Joi.string()
      .max(appConfig.posting.message.maxChars)
      .required(),
  }),
};

const removeThread = {
  params: Joi.object().keys({
    threadid: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const removeReply = {
  params: Joi.object().keys({
    replyid: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const removePost = {
  params: Joi.object().keys({
    postid: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

module.exports = {
  getPosts,
  thread,
  reply,
  removeThread,
  removeReply,
  removePost,
};
