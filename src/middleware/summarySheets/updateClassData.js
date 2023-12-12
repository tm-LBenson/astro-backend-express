'use strict';

async function updateClassData(req, res, next) {
  try {
    const classData = req.classData;
    const { students } = req.body;

    if (students && Array.isArray(students)) {
      classData.students = students;
      await classData.save();
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = updateClassData;
