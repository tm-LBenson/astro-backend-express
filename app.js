'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const handle404Error = require('./src/middleware/404');
const handle500Error = require('./src/middleware/500');
const router = require('./src/routes/routes');
require('dotenv').config();

// Enable Cors on all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

mongoose.set('strictQuery', true);

// Create connections to two different MongoDB databases
const analyticsDB = mongoose.createConnection(process.env.DB_URL, {
  useNewUrlParser: true,
  bufferCommands: false,
  // other options...
});

analyticsDB.on('connected', () => {
  console.log('Connected to Analytics MongoDB');
});

analyticsDB.on('error', (err) => {
  console.error('Error connecting to Analytics MongoDB:', err);
});

const summaryDB = mongoose.createConnection(process.env.SUMMARY_DB_URL, {
  useNewUrlParser: true,
  bufferCommands: false,
  // other options...
});

summaryDB.on('connected', () => {
  console.log('Connected to Summary MongoDB');
});

summaryDB.on('error', (err) => {
  console.error('Error connecting to Summary MongoDB:', err);
});

// Routes
app.use(router);

// 404 Error Handler
app.use(handle404Error);

// 500 Error Handler
app.use(handle500Error);

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
