const { Schema, model } = require('mongoose');
const { pick } = require('lodash');
const formatBytes = require('../utils/formatBytes');
const appConfig = require('../config/appConfig');
const { mimeTypesValues } = require('../config/filetypes');
const Thread = require('./thread.model');

const boardShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  anonymous: {
    type: String,
    default: 'Anonymous',
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  screened: {
    type: Boolean,
    default: false,
  },
  forcedanon: {
    type: Boolean,
    default: appConfig.boards.anonymous.forced,
  },
  maxpages: {
    type: Number,
    required: true,
    default: appConfig.boards.maxpages,
  },
  maxreplies: {
    type: Number,
    required: true,
    default: appConfig.boards.maxreplies,
  },
  postsperpage: {
    type: Number,
    required: true,
    default: appConfig.boards.postsperpage,
  },
  section: {
    type: String,
    enum: appConfig.boards.sections,
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  flag: {
    type: String,
  },
  allowedfiletypes: {
    type: Array,
    default: ['image/png', 'image/jpeg'],
  },
  maxfilesize: {
    type: Number,
    default: 1 * 1024 * 1024 * 10,
  },
});

boardShema.virtual('max_file_size').get(function() {
  return formatBytes(this.maxfilesize);
});

boardShema.virtual('allowed_filetypes').get(function() {
  return this.allowedfiletypes.map(mimeType => mimeTypesValues[mimeType]);
});

boardShema.methods.toJSON = function() {
  const board = this;
  return board.toObject({ virtuals: true });
};

boardShema.methods.transform = function() {
  const board = this;
  return board.toJSON();
};

boardShema.methods.pick = function(topick = []) {
  return pick(this.toJSON(), topick);
};

boardShema.methods.getPagesCount = async function() {
  const board = this;
  return Math.floor(await Thread.countDocuments({ board, deleted: false })) / this.postsperpage;
};

const Board = model('Board', boardShema);

module.exports = Board;
