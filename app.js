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

// Connect to MongoDB using Mongoose
mongoose.set('strictQuery', true);

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
}

connectToMongoDB();

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
