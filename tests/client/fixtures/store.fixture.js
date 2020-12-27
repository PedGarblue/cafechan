const moment = require('moment');

const storeFixture = {
  state: {
    tokens: {
      refresh: {
        token: 'some token',
        expires: moment().add(1, 'days'),
      },
      access: {
        token: 'some token',
        expires: moment().add(5, 'minutes'),
      },
    },
    refreshTokenTask: 1,
  },
  dispatch: jest.fn(),
  commit: jest.fn(),
};

module.exports = {
  storeFixture,
};
