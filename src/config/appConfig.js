const Joi = require('@hapi/joi');
const path = require('path');
const configFile = require('../config.json');

const configSchema = Joi.object().keys({
  boards: Joi.object().keys({
    maxpages: Number,
    postsperpage: Number,
    maxreplies: Number,
    anonymous: Joi.object().keys({
      forced: Boolean,
      default: String,
    }),
    sections: Joi.array().items(Joi.string()),
  }),
  posting: Joi.object().keys({
    name: Joi.object().keys({
      default: String,
      maxChars: Number,
    }),
    title: Joi.object().keys({
      maxChars: Number,
    }),
    message: Joi.object().keys({
      maxChars: Number,
    }),
  }),
  dirs: Joi.object().keys({
    boardnames: Joi.string()
      .pattern(/\w+\.json$/m, '.json file')
      .default('tablones.json'),
  }),
});

const { value: configVars, error } = configSchema.prefs({ errors: { label: 'key' } }).validate(configFile);

if (error) {
  throw new Error(`Error at validating site config ${error.message}`);
}
const root = path.join(__dirname, '/../../');
module.exports = {
  boards: {
    maxpages: configVars.boards.maxpages,
    maxreplies: configVars.boards.maxreplies,
    postsperpage: configVars.boards.postsperpage,
    anonymous: {
      forced: configVars.boards.anonymous.forced,
      default: configVars.boards.anonymous.default,
    },
    sections: configVars.boards.sections,
  },
  posting: {
    name: {
      maxChars: configVars.posting.name.maxChars,
      default: configVars.posting.name.default,
    },
    title: {
      maxChars: configVars.posting.title.maxChars,
    },
    message: {
      maxChars: configVars.posting.message.maxChars,
    },
  },
  dirs: {
    boardnames: path.join(root, 'storage', configVars.dirs.boardnames),
  },
};
