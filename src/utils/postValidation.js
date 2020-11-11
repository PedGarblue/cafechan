// const Post = require('../models/post.model');
const Thread = require('../models/post.model');
const Reply = require('../models/post.model');
const PostValidationError = require('./PostValidationError');

const config = {
  timeBetweenPosts: 60 * 3,
  messages: {
    inPostRatio: time => `Oops, hay demasiados nuevos posts en cola en este momento.\nEspera ${Math.round(time)} segundos`,
    notDuplicated: 'Oops, tu post parece duplicado o flood.',
  },
};

const validateAux = (post, auxs) => {
  const { lastPosts } = auxs;

  return {
    inPostRatio(minTimeBetweenPosts = config.timeBetweenPosts) {
      const lastPost = lastPosts[0];
      const now = Date.now();
      if (!lastPost) return validateAux(post, auxs);
      const timeBetweenPosts = now - lastPost.timestamp;
      if (timeBetweenPosts < minTimeBetweenPosts)
        throw new PostValidationError(config.messages.inPostRatio(minTimeBetweenPosts - timeBetweenPosts));
      return validateAux(post, auxs);
    },
    notDuplicated() {
      if (!lastPosts) return validateAux(post, auxs);
      const matchedPosts = lastPosts.filter(lastPost => lastPost.message === post.message);
      if (matchedPosts.length > 0) throw new PostValidationError(config.messages.notDuplicated);
      return validateAux(post, auxs);
    },
  };
};

const validate = async post => {
  const PostModel = post.kind === 'Thread' ? Thread : Reply;
  const lastPosts = await PostModel.find({ board: post.board, thread: post.thread }).sort({ timestamp: -1 });

  return validateAux(post, {
    lastPosts,
  });
};

module.exports = {
  validate,
};
