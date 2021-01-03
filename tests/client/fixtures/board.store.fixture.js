const board = {
  id: 'some id',
  max_file_size: '10 MB',
  allowed_filetypes: ['PNG', 'JPG'],
  name: 'test',
  desc: 'Testing',
};
const pagination = {
  actual: 1,
  totalpages: 10,
};
export default {
  getters: {
    isBoardLoaded: jest.fn(() => false),
    getBoard: jest.fn(() => board),
    getThreads: jest.fn(() => []),
    getSections: jest.fn(() => []),
    getPagination: jest.fn(() => pagination),
  },
  actions: {
    BOARD_REQUEST: jest.fn(),
  },
};
