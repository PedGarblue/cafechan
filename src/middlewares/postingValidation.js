const Thread = require('../models/post.model');
const Reply = require('../models/post.model');
const AppError = require('../utils/AppError');

const config = {
  minTimeBetweenPosts: 1000 * 60,
  messages: {
    inPostRatio: time => `Oops, hay muchos posts en cola en este momento.\nEspera ${Math.round(time)} segundos`,
    notDuplicated: 'Oops, tu post parece flood o está duplicado.',
  },
};

const inPostingRatio = ({ post, auxs }) =>
  new Promise((resolve, reject) => {
    const { lastPosts } = auxs;
    const lastPost = lastPosts[0];
    const now = Date.now();
    if (!lastPost) resolve({ post, auxs });
    const timeBetweenPosts = now - lastPost.timestamp;
    if (timeBetweenPosts < config.minTimeBetweenPosts)
      reject(new AppError(400, config.messages.inPostRatio((config.minTimeBetweenPosts - timeBetweenPosts) / 1000)));
    resolve({ post, auxs });
  });

const notDuplicated = ({ post, auxs }) =>
  new Promise((resolve, reject) => {
    const { lastPosts } = auxs;
    if (!lastPosts) resolve({ post, auxs });
    const matchedPosts = [].concat(lastPosts).filter(lastPost => lastPost.message === post.message);
    if (matchedPosts.length > 0) reject(new AppError(400, config.messages.notDuplicated));
    resolve({ post, auxs });
  });

const validate = (post, auxs) => {
  return new Promise(resolve => {
    resolve({ post, auxs });
  });
};

const thread = async (req, res, next) => {
  const post = req.body;
  const lastPosts = await Thread.find({ board: post.board }, null, { sort: { created_at: -1 } });
  return validate(post, { lastPosts })
    .then(inPostingRatio)
    .then(notDuplicated)
    .then(() => next())
    .catch(err => next(err));
};

const reply = async (req, res, next) => {
  const post = req.body;
  const lastPosts = await Reply.find({ board: post.board, thread: post.thread }, null, { sort: { created_at: -1 } });
  return validate(post, { lastPosts })
    .then(inPostingRatio)
    .then(notDuplicated)
    .then(() => next())
    .catch(err => next(err));
};

module.exports = {
  thread,
  reply,
};
