'use strict';

async function summarySheet(req, res, next) {
  console.log(req.body);
  res.status(200).send('Got it!');
}

module.exports = summarySheet;
