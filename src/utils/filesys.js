const fs = require('fs');

const writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFile(file, data, err => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const readFile = file => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const fileExists = file => {
  return new Promise(resolve => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.access(file, fs.constants.F_OK, err => {
      resolve(!err);
    });
  });
};

module.exports = {
  writeFile,
  readFile,
  fileExists,
};
