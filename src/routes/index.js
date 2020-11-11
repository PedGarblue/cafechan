const express = require('express');
const postRoute = require('./post.route');
const panelRoute = require('./panel.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const boardRoute = require('./board.route');
const banRoute = require('./bans.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/board', boardRoute);
router.use('/user', userRoute);
router.use('/panel', panelRoute);
router.use('/ban/', banRoute);
router.use('/', postRoute);
module.exports = router;
