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
});
