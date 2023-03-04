/** @format */

function handle500Error(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}

module.exports = handle500Error;
