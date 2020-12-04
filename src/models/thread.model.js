const { omit } = require('lodash');
const { Schema, Types } = require('mongoose');
const { unescape } = require('lodash');
const Post = require('./post.model');
const Reply = require('./reply.model');
const appConfig = require('../config/appConfig');
const dateUtil = require('../utils/date.util');

const threadSchema = new Schema(
  {
    // no thread on threads
    thread: {
      type: Types.ObjectId,
      validate: () => Promise.reject(new Error("You can't set a thread in a Thread model")),
    },
    title: {
      type: String,
      maxlength: appConfig.posting.title.maxChars,
    },
    stickied: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    moved: {
      type: Boolean,
      default: false,
    },
    lastbump: {
      type: Number,
      default: () => Date.now(),
    },
  },
  {
    discriminatorKey: 'kind',
    collection: 'posts',
  }
);

threadSchema.methods.delete = async function() {
  const thread = this;
  thread.deleted = true;
  thread.deleted_at = Date.now();
  const replies = await Reply.find({ thread });
  replies.map(reply => reply.delete());
  await thread.save();
};

threadSchema.methods.toJSON = function() {
  const post = omit(this.toObject({ virtuals: true }), ['thread']);
  post.ip = post.ip.content;
  return post;
};

threadSchema.methods.transform = function() {
  let thread = this;
  thread = thread.toJSON();
  thread.title = unescape(thread.title);
  thread.timestamp = dateUtil.formatTimestamp(thread.created_at);
  return thread;
};

threadSchema.methods.getReplies = async function() {
  const thread = this;
  const replies = await Reply.find({ thread });
  return replies.map(reply => reply.transform());
};

threadSchema.pre('remove', async function() {
  const thread = this;
  const replies = await Reply.find({ thread });
  replies.map(reply => reply.remove());
});
const Thread = Post.discriminator('Thread', threadSchema);

module.exports = Thread;
