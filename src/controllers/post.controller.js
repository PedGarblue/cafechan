const { pick } = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService, boardService, boardpageService, cacheService } = require('../services');

const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPosts(req.query);
  const response = posts.map(post => post.transform());
  res.json(response);
});

const getBoardPage = catchAsync(async (req, res) => {
  const { boardname, page } = req.params;
  const board = await boardService.getBoard(boardname);
  if (page === 1) res.redirect(`/${boardname}/`);
  const query = {
    page: page || 1,
    limit: board.postsperpage,
  };
  res.status(httpStatus.OK).format({
    html: async () => {
      res.render('boardpage', await boardpageService.getBoardPage(board, query));
    },
    json: async () => {
      res.json(await boardpageService.getBoardPage(board, query));
    },
    default: async () => {
      res.json(await boardpageService.getBoardPage(board, query));
    },
  });
});

const getThread = catchAsync(async (req, res) => {
  const { boardname, threadid } = req.params;
  const board = await boardService.getBoard(boardname);
  const thread = await postService.getThread(board, threadid, true);

  res.status(httpStatus.OK).format({
    html: async () => {
      const data = await boardpageService.getThreadPage(board, thread);
      res.render('thread', data);
    },
    json: async () => {
      res.json(await boardpageService.getThreadPage(board, thread));
    },
    default: async () => {
      res.json(await boardpageService.getThreadPage(board, thread));
    },
  });
});

const postThread = catchAsync(async (req, res) => {
  const { boardname } = req.params;
  const { board: boardid } = req.body;
  const board = await boardService.getBoardById(boardid);
  const postData = pick(req.body, ['title', 'message', 'board']);
  const posterData = { ip: req.ip };
  const threadBody = Object.assign(postData, posterData);

  const thread = await postService.createThread(board, threadBody);

  await cacheService.refreshBoardCache(board);

  res.status(httpStatus.CREATED).format({
    html: () => {
      res.redirect(`/${boardname}/`);
    },
    json: () => {
      res.json(thread);
    },
    default: () => {
      res.json(thread);
    },
  });
});

const postReply = catchAsync(async (req, res) => {
  const { boardname } = req.params;
  const { board: boardid, thread: threadid } = req.body;
  const board = await boardService.getBoardById(boardid);
  const postData = pick(req.body, ['message', 'board', 'thread']);
  const posterData = { ip: req.ip };
  const replyBody = Object.assign(postData, posterData);
  const thread = await postService.getThreadById(threadid);

  const reply = await postService.createReply(board, thread, replyBody);

  await cacheService.refreshBoardCache(board);
  await cacheService.refreshThreadCache(thread, board);

  res.status(httpStatus.CREATED).format({
    html: () => {
      res.redirect(`/${boardname}/`);
    },
    json: () => {
      res.json(reply);
    },
    default: () => {
      res.json(reply);
    },
  });
});

const removeThread = catchAsync(async (req, res) => {
  const { threadid } = req.params;
  const thread = await postService.deleteThread(threadid, req.ip);
  const board = await boardService.getBoardById(thread.board);

  await cacheService.refreshBoardCache(board);
  await cacheService.refreshThreadCache(thread, board);

  res.status(httpStatus.NO_CONTENT).send();
});

const removeReply = catchAsync(async (req, res) => {
  const { replyid } = req.params;
  const reply = await postService.deleteReply(replyid, req.ip);
  const board = await boardService.getBoardById(reply.board);
  const thread = await postService.getThreadById(reply.thread);

  await cacheService.refreshBoardCache(board);
  await cacheService.refreshThreadCache(thread, board);

  res.status(httpStatus.NO_CONTENT).send();
});

const removePost = catchAsync(async (req, res) => {
  const { postid } = req.params;
  const post = await postService.removePost(postid);
  const board = await boardService.getBoardById(post.board);

  if (post.kind === 'Thread') {
    await cacheService.refreshBoardCache(board);
    await cacheService.refreshThreadCache(post, board);
  } else {
    const thread = await postService.getThreadById(post.thread);
    await cacheService.refreshBoardCache(board);
    await cacheService.refreshThreadCache(thread, board);
  }

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPosts,
  getBoardPage,
  getThread,
  postThread,
  postReply,
  removeThread,
  removeReply,
  removePost,
};
