import { Types } from 'mongoose';
import { banOne, banTwo } from '@/tests/client/fixtures/ban.fixture';

jest.genMockFromModule('../ban');

export const getBans = jest.fn().mockResolvedValue([banOne, banTwo]);

export const sendBan = jest.fn(async ban => Object.assign(ban, { ip: Types.ObjectId() }));

export const deleteBan = jest.fn().mockResolvedValue();
