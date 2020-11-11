const appConfig = require('../config/appConfig');

const getQueryOptions = query => {
  const page = query.page * 1 || 1;
  const limit = query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const sort = {};
  if (query.sortBy) {
    const parts = query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  return { limit, skip, sort };
};
const filterBoardsBySection = (boards, section) => {
  return boards
    .filter(board => {
      return board.section === section;
    })
    .sort();
};

const getSectionsWithBoards = boards => {
  return appConfig.boards.sections.map(section => {
    return {
      name: section,
      boards: filterBoardsBySection(boards, section),
    };
  });
};

module.exports = {
  getQueryOptions,
  getSectionsWithBoards,
};
