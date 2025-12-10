const sanitizeHTML = require('sanitize-html');

const sanitize = (req, res, next) => {
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      req.params[key] = sanitizeHTML(req.params[key]);
    });
  }
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeHTML(req.query[key]);
    });
  }

  next();
};

module.exports = sanitize;
