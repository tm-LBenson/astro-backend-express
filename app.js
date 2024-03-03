'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const handle404Error = require('./src/middleware/404');
const handle500Error = require('./src/middleware/500');
const router = require('./src/routes/routes');

// Import the database connections (the connections themselves are established in database.js)
require('./database');

require('dotenv').config();

// Enable Cors on all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use(router);

// 404 Error Handler
app.use(handle404Error);

// 500 Error Handler
app.use(handle500Error);

// Start discord bot
require('tom-roles');

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
