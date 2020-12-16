const express = require('express');

const postsRoute = require('./api/post.route');
const userRoute = require('./api/user.route');
const boardRoute = require('./api/board.route');
const authRoute = require('./api/auth.route');
const banRoute = require('./api/bans.route');
const postingRoute = require('./post.route');
const panelRoute = require('./panel.route');

const router = express.Router();

router.use('/api/posts', postsRoute);
router.use('/api/user', userRoute);
router.use('/api/board', boardRoute);
router.use('/api/auth', authRoute);
router.use('/api/ban', banRoute);
router.use('/panel', panelRoute);
router.use('/', postingRoute);

module.exports = router;
