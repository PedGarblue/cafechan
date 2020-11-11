const { omit } = require('lodash');
const { Schema, SchemaTypes } = require('mongoose');
const Post = require('./post.model');

const replySchema = new Schema(
  {
    thread: {
      type: SchemaTypes.ObjectId,
      ref: 'Thread',
      required: true,
    },
  },
  {
    discriminatorKey: 'kind',
    collection: 'posts',
  }
);

replySchema.methods.toJSON = function() {
  const post = this;
  return omit(post.toObject({ virtuals: true }), ['ip', 'password']);
};

const Reply = Post.discriminator('Reply', replySchema);

module.exports = Reply;
