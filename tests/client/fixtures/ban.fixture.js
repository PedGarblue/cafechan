import ObjectId from '@/tests/client/utils/objectid';
import faker from 'faker';

const banTimes = require('@/src/config/banTimes');

export const banOne = {
  _id: ObjectId(),
  ip: faker.internet.ip(),
  reason: 'Shitposting',
  until: Date.now() + banTimes.hour(),
};

export const banTwo = {
  _id: ObjectId(),
  ip: faker.internet.ip(),
  reason: 'Shitposting',
  until: Date.now() + banTimes.hour(),
};
