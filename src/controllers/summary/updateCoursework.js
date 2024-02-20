const ClassData = require('../../models/summaryModel');

async function updateCoursework(req, res, next) {
  try {
    const { classId, studentEmail, type, topic, updates } = req.body;
    const query = {
      classId: classId,
      'students.email': studentEmail,
      'students.coursework': { $elemMatch: { type: type, topic: topic } },
    };
    const updateOperation = {
      $set: {},
    };

    Object.keys(updates).forEach((key) => {
      updateOperation.$set[`students.$.coursework.$[course].${key}`] =
        updates[key];
    });
    const options = {
      arrayFilters: [{ 'course.type': type, 'course.topic': topic }],
      new: true,
    };

    const updatedClassData = await ClassData.findOneAndUpdate(
      query,
      updateOperation,
      options
    );
        
    res.status(200).json(updatedClassData);
  } catch (error) {
    next(error);
  }
}

module.exports = updateCoursework;
