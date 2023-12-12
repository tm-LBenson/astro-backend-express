'use strict';

const ClassData = require('../../models/summaryModel');

async function checkForID(req, res, next) {
  try {
    const { classId } = req.body;
    if (!classId) {
      throw new Error('classId is required');
    }

    let classData = await ClassData.findOne({ classId });
    if (!classData) {
      classData = new ClassData({ classId, students: [] });
      await classData.save();
    }

    req.classData = classData;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkForID;
