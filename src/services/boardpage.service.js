const { round } = require('lodash');
const { postService, boardService } = require('.');
const { Thread } = require('../models');

const getBoardPage = async (board, query) => {
  // eslint-disable-next-line no-param-reassign
  query.sortBy = 'lastbump:desc';
  // eslint-disable-next-line no-param-reassign
  board = board.transform();
  const threads = await postService.getThreads(board, query);
  const sections = await boardService.getSections();
  const totalpages = round((await Thread.countDocuments({ board })) / board.postsperpage);
  const page = {
    key: 'boardpage',
    actual: parseInt(query.page, 10) || 1,
    totalpages,
  };
  return {
    page,
    board,
    threads,
    sections,
  };
};

const getThreadPage = async (board, thread) => {
  const sections = await boardService.getSections();
  // eslint-disable-next-line no-param-reassign
  board = board.transform();
  return {
    page: { key: 'thread' },
    board,
    thread,
    sections,
  };
};
module.exports = {
  getBoardPage,
  getThreadPage,
};
