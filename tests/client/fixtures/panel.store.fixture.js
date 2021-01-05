import moment from 'moment';

export const tokens = {
  refresh: {
    token: 'some token here',
    expires: moment().add(1, 'days'),
  },
  access: {
    token: 'some token here',
    expires: moment().add(5, 'minutes'),
  },
};

export default {
  state: {
    tokens,
    refreshTokenTask: 1,
  },
  getters: {
    accessToken: () => tokens.access,
  },
  dispatch: jest.fn(),
  commit: jest.fn(),
};
