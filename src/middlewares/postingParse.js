const sanitize = post =>
  new Promise(resolve => {
    const _post = post;
    _post.message = post.message.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
    resolve(_post);
  });

const parseGreentext = post =>
  new Promise(resolve => {
    const regex = /^(&gt;).+\r?\n?/gm;
    const _post = post;
    _post.message = post.message.replace(regex, match => {
      const textFiltered = match.replace(/\r\n$/gm, '');
      return `<span class="greentext">${textFiltered}</span>\r\n`;
    });
    resolve(_post);
  });

const parseRedtext = post =>
  new Promise(resolve => {
    const regex = /^(&lt;).+\r?\n?/gm;
    const _post = post;
    _post.message = post.message.replace(regex, match => {
      const textFiltered = match.replace(/\r\n$/gm, '');
      return `<span class="redtext">${textFiltered}</span>\r\n`;
    });
    resolve(_post);
  });

const parse = post => {
  return new Promise(resolve => resolve(post));
};

const parsePostMiddleware = async (req, res, next) => {
  const parsedPost = await parse(req.body)
    .then(sanitize)
    .then(parseGreentext)
    .then(parseRedtext)
    .catch(err => next(err));
  req.body = parsedPost;
  next();
};

module.exports = parsePostMiddleware;
