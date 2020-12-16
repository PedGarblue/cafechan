const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postController = require('../../controllers/post.controller');
const postRequestValidation = require('../../validations/posting.validation');

const router = express.Router();

// obtener lista de posts
router.route('/').get(auth('managePosts'), validate(postRequestValidation.getPosts), postController.getPosts);

router.route('/:postid').delete(auth('managePosts'), validate(postRequestValidation.removePost), postController.removePost);

router.route('/thread/:threadid').delete(validate(postRequestValidation.removeThread), postController.removeThread);

router.route('/reply/:replyid').delete(validate(postRequestValidation.removeReply), postController.removeReply);

module.exports = router;
