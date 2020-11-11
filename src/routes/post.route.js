const express = require('express');
const frontController = require('../controllers/front.controller');
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate');
const postingValidation = require('../validations/posting.validation');
const auth = require('../middlewares/auth');
const cache = require('../middlewares/cache');
const ban = require('../middlewares/ban');

const router = express.Router({ strict: true });

// obtener lista de posts
router.route('/posts/').get(auth('managePosts'), validate(postingValidation.getPosts), postController.getPosts);

router
  .route('/posts/:postid')
  .delete(auth('managePosts'), validate(postingValidation.removePost), postController.removePost);

router.route('/posts/thread/:threadid').delete(validate(postingValidation.removeThread), postController.removeThread);

router.route('/posts/reply/:replyid').delete(validate(postingValidation.removeReply), postController.removeReply);

// frontpage
router.route('/').get(cache.middleware(), frontController.frontPage);

// boardpage
router
  .route('/:boardname/:page?/')
  .get(cache.middleware(), postController.getBoardPage)
  .post(ban.check, validate(postingValidation.thread), postController.postThread);

// threadpage
router
  .route('/:boardname/thread/:threadid/')
  .get(cache.middleware(), postController.getThread)
  .post(ban.check, validate(postingValidation.reply), postController.postReply);

module.exports = router;
