const { handler } = require('../server');

module.exports = (req, res) => {
  const original = new URL(req.url, 'http://localhost');
  const slug = req.query?.path;
  const segments = Array.isArray(slug) ? slug.join('/') : String(slug ?? '');
  req.url = `/api/${segments}${original.search}`;
  return handler(req, res);
};
