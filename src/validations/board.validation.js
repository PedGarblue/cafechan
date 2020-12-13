const Joi = require('@hapi/joi');
const appConfig = require('../config/appConfig');
const { objectId } = require('./custom.validation');

const getBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

const getBoards = {
  query: Joi.object().keys({
    name: Joi.string(),
    section: Joi.string().valid(...appConfig.boards.sections),
    locked: Joi.boolean(),
    screened: Joi.boolean(),
    sortBy: Joi.string(),
  }),
};

const createBoard = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    anonymous: Joi.string(),
    locked: Joi.boolean(),
    screened: Joi.boolean(),
    maxreplies: Joi.number(),
    postperpage: Joi.number(),
    section: Joi.string()
      .valid(...appConfig.boards.sections)
      .required(),
    nsfw: Joi.boolean(),
    flag: Joi.string(),
    maxfilesize: Joi.number(),
    allowedfiletypes: Joi.array().items(Joi.string()),
  }),
};

const editBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    desc: Joi.string(),
    anonymous: Joi.string(),
    locked: Joi.boolean(),
    screened: Joi.boolean(),
    maxreplies: Joi.number(),
    postperpage: Joi.number(),
    section: Joi.string().valid(...appConfig.boards.sections),
    nsfw: Joi.boolean(),
    flag: Joi.string(),
    maxfilesize: Joi.number(),
    allowedfiletypes: Joi.array().items(Joi.string()),
  }),
};

const deleteBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getBoards,
  createBoard,
  editBoard,
  deleteBoard,
  getBoard,
};
