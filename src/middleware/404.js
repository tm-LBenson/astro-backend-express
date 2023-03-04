/** @format */

function handle404Error(req, res) {
  res.status(404).send("Sorry, can't find that!");
}

module.exports = handle404Error;
