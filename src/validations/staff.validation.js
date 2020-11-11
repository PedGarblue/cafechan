const Joi = require('@hapi/joi');

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const getStaffById = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const getStaff = {
  query: Joi.object().keys({
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = { login, getStaffById, getStaff };
