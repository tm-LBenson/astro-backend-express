'use strict';

async function summarySheet(req, res, next) {
  res.status(200).send(req.classData);
}

module.exports = summarySheet;
