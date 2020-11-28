const parseGreentext = post =>
  new Promise(resolve => {
    const regex = /^(>|&gt;).+\n?/gm;
    const _post = post;
    _post.message = post.message.replace(regex, match => {
      const noBreaksLines = match.replace('\n', '');
      return `<span class="greentext">${noBreaksLines}</span>`;
    });
    resolve(_post);
  });

const parseRedtext = post =>
  new Promise(resolve => {
    const regex = /^(<|&lt;).+\n?/gm;
    const _post = post;
    _post.message = post.message.replace(regex, match => {
      const textFiltered = match.replace('\n', '').replace('<', '&lt;');
      return `<span class="redtext">${textFiltered}</span>`;
    });
    resolve(_post);
  });

const parse = post => {
  return new Promise(resolve => resolve(post));
};

const parsePostMiddleware = async (req, res, next) => {
  const parsedPost = await parse(req.body)
    .then(parseRedtext)
    .then(parseGreentext)
    .catch(err => next(err));
  req.body = parsedPost;
  next();
};

module.exports = parsePostMiddleware;
