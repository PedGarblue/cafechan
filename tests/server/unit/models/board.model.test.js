const faker = require('faker');
const { Board } = require('../../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');

setupTestDB();

describe('Board Model', () => {
  let newBoard;
  beforeEach(() => {
    newBoard = {
      name: faker.lorem.word(),
      desc: faker.lorem.word(),
    };
  });
  describe('Board validation', () => {
    test('should validate a valid board', async () => {
      await expect(new Board(newBoard).validate()).resolves.toBeUndefined();
    });
  });

  describe('Board virtuals', () => {
    test('should return formatted maxfilesize', () => {
      newBoard.maxfilesize = 1024 * 1024 * 10;
      const board = new Board(newBoard);
      expect(board.transform().max_file_size).toMatch('10 MB');
    });
  });

  describe('Board transform()', () => {
    test('should return parsed value of allowedfiletypes', () => {
      newBoard.allowedfiletypes = ['image/jpeg', 'image/png'];
      const board = new Board(newBoard);
      expect(board.transform().allowedfiletypes).toEqual(['JPG', 'PNG']);
    });
  });
});
