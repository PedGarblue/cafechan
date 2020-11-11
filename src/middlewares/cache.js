const mcache = require('memory-cache');

const ACCESS_PREFIX = `__express__`;

const put = (key, body) => {
  mcache.put(ACCESS_PREFIX + key, body);
};

const del = key => {
  mcache.del(ACCESS_PREFIX + key);
};

const middleware = () => (req, res, next) => {
  const key = `${ACCESS_PREFIX}${req.originalUrl || req.url}`;
  const cachedBody = mcache.get(key);
  res.format({
    html: () => {
      if (cachedBody) {
        res.send(cachedBody);
      } else {
        res.sendResponse = res.send;
        res.send = body => {
          mcache.put(key, body);
          res.sendResponse(body);
        };
        next();
      }
    },
    json: () => {
      next();
    },
    default: () => {
      next();
    },
  });
};

module.exports = {
  middleware,
  put,
  del,
};
