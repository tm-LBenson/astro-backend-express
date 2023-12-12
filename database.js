// database.js
'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);

// Connection to the Analytics database
const analyticsDB = mongoose.createConnection(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

analyticsDB.on('connected', () => {
  console.log('Connected to Analytics MongoDB');
});

analyticsDB.on('error', (err) => {
  console.error('Error connecting to Analytics MongoDB:', err);
});

// Connection to the Summary database
const summaryDB = mongoose.createConnection(process.env.SUMMARY_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

summaryDB.on('connected', () => {
  console.log('Connected to Summary MongoDB');
});

summaryDB.on('error', (err) => {
  console.error('Error connecting to Summary MongoDB:', err);
});

module.exports = { analyticsDB, summaryDB };
