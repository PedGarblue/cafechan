const { del: cacheDelete } = require('../middlewares/cache');

const refreshBoardCache = async board => {
  const pagesCount = await board.getPagesCount();
  const boardRoute = `/${board.name}/`;
  cacheDelete(boardRoute);
  for (let i = 1; i <= pagesCount; i += 1) {
    cacheDelete(boardRoute + i);
  }
};

const refreshThreadCache = async (thread, board) => {
  const threadRoute = `/${board.name}/thread/${thread.seq_id}/`;
  cacheDelete(threadRoute);
};

module.exports = {
  refreshBoardCache,
  refreshThreadCache,
};
