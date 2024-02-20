const ClassData = require('../../models/summaryModel');
async function addStudent(req, res, next) {
  const { classId, student } = req.body; // `student` is a new student object

  await ClassData.findOneAndUpdate(
    { classId: classId },
    { $push: { students: student } },
    { new: true }
  );

  res.status(200).json({ message: 'Student added successfully.' });
}

module.exports = addStudent;
