'use strict';

const mongoose = require('mongoose');
const { summaryDB } = require('../../database');
const WeeklyNotesSchema = new mongoose.Schema({
  class: String,
  note: String,
});
const CourseworkSchema = new mongoose.Schema({
  type: String,
  topic: String,
  result: String,
  status: String,
  attendance: String,
  notes: [WeeklyNotesSchema],
});

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  coursework: [CourseworkSchema],
  notes: String,
});

const ClassDataSchema = new mongoose.Schema({
  classId: {
    type: String,
    unique: true,
    required: true,
  },
  students: [StudentSchema],
});

const ClassData = summaryDB.model('ClassData', ClassDataSchema);

module.exports = ClassData;
