import ObjectId from '@/tests/client/utils/objectid';

const idOne = ObjectId();
const idTwo = ObjectId();

export const boardOne = {
  _id: idOne,
  id: idOne,
  name: 'tst',
  desc: 'test board',
  section: 'ocio',
  locked: false,
  allowed_filetypes: ['PNG', 'JPG'],
  allowedfiletypes: ['image/png', 'image/jpeg'],
  maxfilesize: 10 * 1024 * 1024,
  max_file_size: '10 MB',
  maxpages: 7,
  maxreplies: 200,
  nsfw: false,
  postsperpage: 5,
};

export const boardTwo = {
  _id: idTwo,
  id: idTwo,
  name: 'pol',
  desc: 'Politica',
  section: 'ocio',
  locked: false,
  allowed_filetypes: ['PNG', 'JPG'],
  allowedfiletypes: ['image/png', 'image/jpeg'],
  maxfilesize: 10 * 1024 * 1024,
  max_file_size: '10 MB',
  maxpages: 10,
  maxreplies: 150,
  nsfw: false,
  postsperpage: 7,
};
