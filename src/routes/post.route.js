const express = require('express');

const frontController = require('../controllers/front.controller');
const postController = require('../controllers/post.controller');
const cache = require('../middlewares/cache');

const router = express.Router({ strict: true });

// frontpage
router.route('/').get(cache.middleware(), frontController.frontPage);

// boardpage
router.route('/:boardname/:page?/').get(cache.middleware(), postController.getBoardPage);

// threadpage
router.route('/:boardname/thread/:threadid/').get(cache.middleware(), postController.getThread);

module.exports = router;
