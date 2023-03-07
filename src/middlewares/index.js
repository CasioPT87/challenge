const logger = require("../logger");

function logErrorMiddleware(err, req, res, next) {
  console.log('middleware!!!')
  logger.error(err);
  res.status(500).json({ error: 'Error fetching data' })
}

module.exports = {
  logErrorMiddleware,
};
