const { del: cacheDelete, delByKeys } = require('../middlewares/cache');

const refreshFrontpageCache = async () => {
  const frontRoute = '/';
  cacheDelete(frontRoute);
};

const refreshBoardCache = async (board, cleanThreads = false) => {
  const pagesCount = await board.getPagesCount();
  const boardRoute = `/${board.name}/`;
  cacheDelete(boardRoute);
  for (let i = 1; i <= pagesCount; i += 1) {
    cacheDelete(boardRoute + i);
  }
  if (cleanThreads) delByKeys(`/${board.name}/thread/`);
};

const refreshThreadCache = async (thread, board) => {
  const threadRoute = `/${board.name}/thread/${thread.seq_id}/`;
  cacheDelete(threadRoute);
};

module.exports = {
  refreshFrontpageCache,
  refreshBoardCache,
  refreshThreadCache,
};
