import { boardOne } from './board.fixture';

const pagination = {
  actual: 1,
  totalpages: 10,
};

export default {
  getters: {
    isBoardLoaded: jest.fn(() => false),
    getBoard: jest.fn(() => boardOne),
    getThreads: jest.fn(() => []),
    getSections: jest.fn(() => []),
    getPagination: jest.fn(() => pagination),
  },
  actions: {
    BOARD_REQUEST: jest.fn(),
  },
};
