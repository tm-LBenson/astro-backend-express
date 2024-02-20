const ClassData = require('../../models/summaryModel');

async function deleteClass(req, res, next) {
  try {
    const { classId } = req.params;

    const deletionResult = await ClassData.findOneAndDelete({
      classId: classId,
    });

    if (deletionResult) {
      res
        .status(200)
        .json({ message: `Class with id ${classId} has been deleted.` });
    } else {
      res.status(404).json({ message: `Class with id ${classId} not found.` });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = deleteClass;
