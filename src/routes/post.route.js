const express = require('express');
const frontController = require('../controllers/front.controller');
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate');
const postRequestValidation = require('../validations/posting.validation');
const auth = require('../middlewares/auth');
const cache = require('../middlewares/cache');
const ban = require('../middlewares/ban');
const postingValidation = require('../middlewares/postingValidation');
const postingParse = require('../middlewares/postingParse');
const uploadValidation = require('../middlewares/upload.validation');

const router = express.Router({ strict: true });

// obtener lista de posts
router.route('/posts/').get(auth('managePosts'), validate(postRequestValidation.getPosts), postController.getPosts);

router
  .route('/posts/:postid')
  .delete(auth('managePosts'), validate(postRequestValidation.removePost), postController.removePost);

router.route('/posts/thread/:threadid').delete(validate(postRequestValidation.removeThread), postController.removeThread);

router.route('/posts/reply/:replyid').delete(validate(postRequestValidation.removeReply), postController.removeReply);

// frontpage
router.route('/').get(cache.middleware(), frontController.frontPage);

// boardpage
router
  .route('/:boardname/:page?/')
  .get(cache.middleware(), postController.getBoardPage)
  .post(
    ban.check,
    validate(postRequestValidation.thread),
    postingValidation.thread,
    uploadValidation,
    postingParse,
    postController.postThread
  );

// threadpage
router
  .route('/:boardname/thread/:threadid/')
  .get(cache.middleware(), postController.getThread)
  .post(
    ban.check,
    validate(postRequestValidation.reply),
    postingValidation.reply,
    uploadValidation,
    postingParse,
    postController.postReply
  );

module.exports = router;
