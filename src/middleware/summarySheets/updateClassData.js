'use strict';

async function updateClassData(req, res, next) {
  try {
    let classData = req.classData; // Existing data fetched from the database
    const { students: incomingStudents } = req.body; // Incoming students data

    if (incomingStudents && Array.isArray(incomingStudents)) {
      // Iterate over each incoming student
      for (const incomingStudent of incomingStudents) {
        let existingStudent = classData.students.find(
          (s) => s.email === incomingStudent.email
        );
        if (existingStudent) {
          // Update existing student's non-coursework fields if necessary
          existingStudent.name = incomingStudent.name;
          // Iterate over incoming coursework
          for (const incomingCoursework of incomingStudent.coursework) {
            let existingCoursework = existingStudent.coursework.find(
              (cw) =>
                cw.topic === incomingCoursework.topic &&
                cw.type === incomingCoursework.type
            );
            if (existingCoursework) {
              // Preserve existing notes
              incomingCoursework.notes = existingCoursework.notes
                ? existingCoursework.notes
                : incomingCoursework.notes;
            }
          }
          // Replace existing coursework with updated (or merged) coursework
          existingStudent.coursework = incomingStudent.coursework;
        } else {
          // If student doesn't exist, add them to the class
          classData.students.push(incomingStudent);
        }
      }
      await classData.save();
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = updateClassData;
