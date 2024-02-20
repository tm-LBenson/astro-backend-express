const ClassData = require('../../models/summaryModel');
async function addCoursework(req, res, next) {
  const { classId, studentEmail, coursework } = req.body; // `coursework` is a new coursework object

  await ClassData.updateOne(
    { classId: classId, 'students.email': studentEmail },
    { $push: { 'students.$.coursework': coursework } }
  );

  res.status(200).json({ message: 'Coursework added successfully.' });
}
module.exports = addCoursework;
