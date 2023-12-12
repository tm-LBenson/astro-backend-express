'use strict';

const ClassData = require('../../models/summaryModel');

async function getSummaryData(req, res, next) {
  try {
    const allClassData = await ClassData.find({});

    res.status(200).json(allClassData);
  } catch (error) {
    next(error);
  }
}

module.exports = getSummaryData;
