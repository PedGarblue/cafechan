const board = {
  name: 'test',
  desc: 'Testing',
};
export default {
  getters: {
    isBoardLoaded: jest.fn(() => false),
    getBoard: jest.fn(() => board),
    getSections: jest.fn(() => []),
  },
  actions: {
    BOARD_REQUEST: jest.fn(),
  },
};
