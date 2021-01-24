import ObjectId from '@/tests/client/utils/objectid';
import faker from 'faker';

export const userOne = {
  _id: ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'guest',
};

export const userTwo = {
  _id: ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'guest',
};

export const admin = {
  _id: ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  role: 'admin',
};
