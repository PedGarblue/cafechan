const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postingValidation = require('../../middlewares/postingValidation');
const uploadValidation = require('../../middlewares/upload.validation');
const ban = require('../../middlewares/ban');
const postingParse = require('../../middlewares/postingParse');
const postRequestValidation = require('../../validations/posting.validation');
const postController = require('../../controllers/post.controller');

const router = express.Router();

// obtener lista de posts
router.route('/').get(auth('managePosts'), validate(postRequestValidation.getPosts), postController.getPosts);

router.route('/:postid').delete(auth('managePosts'), validate(postRequestValidation.removePost), postController.removePost);

router
  .route('/thread')
  .post(
    ban.check,
    validate(postRequestValidation.thread),
    postingValidation.thread,
    uploadValidation,
    postingParse,
    postController.postThread
  );

router.route('/thread/:threadid').delete(validate(postRequestValidation.removeThread), postController.removeThread);

router
  .route('/reply')
  .post(
    ban.check,
    validate(postRequestValidation.reply),
    postingValidation.reply,
    uploadValidation,
    postingParse,
    postController.postReply
  );

router.route('/reply/:replyid').delete(validate(postRequestValidation.removeReply), postController.removeReply);

module.exports = router;
