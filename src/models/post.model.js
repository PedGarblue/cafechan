const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const { omit, unescape } = require('lodash');
const dateUtil = require('../utils/date.util');
const appConfig = require('../config/appConfig');

const { Schema, SchemaTypes, model } = mongoose;

const postSchema = new Schema(
  {
    seq_id: {
      type: Number,
    },
    board: {
      type: SchemaTypes.ObjectId,
      ref: 'Board',
      required: true,
    },
    thread: {
      type: SchemaTypes.ObjectId,
      ref: 'Thread',
    },
    name: {
      type: String,
      required: true,
      maxlength: appConfig.posting.name.maxChars,
      default: appConfig.boards.anonymous.default,
    },
    message: {
      type: String,
      maxlength: appConfig.posting.message.maxChars,
    },
    file: {
      name: String,
      mimeType: String,
      url: String,
      size: String,
      thumbnailUrl: String,
    },
    tripcode: String,
    email: String,
    password: String,
    ip: String,
    created_at: {
      type: Number,
      alias: 'timestamp',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: Number,
  },
  {
    discriminatorKey: 'kind',
    collection: 'posts',
    timestamps: { createdAt: 'created_at' },
  }
);

postSchema.methods.delete = async function() {
  const post = this;
  post.deleted = true;
  post.deleted_at = Date.now();
  await post.save();
};

postSchema.methods.toJSON = function() {
  const post = this;
  return omit(post.toObject(), ['ip', 'password']);
};

postSchema.methods.transform = function() {
  let post = this;
  post = post.toJSON();
  post.timestamp = dateUtil.formatTimestamp(post.created_at);
  return post;
};

postSchema.plugin(autoIncrement, { id: 'board_sequence', inc_field: 'seq_id', reference_fields: ['board'] });

const Post = model('Post', postSchema);

module.exports = Post;
