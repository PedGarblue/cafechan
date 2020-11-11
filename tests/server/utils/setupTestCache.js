const mcache = require('memory-cache');

const setupTestCache = () => {
  afterEach(() => {
    mcache.clear();
  });
};

module.exports = setupTestCache;
