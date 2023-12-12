// analyticsModel.js
const mongoose = require('mongoose');
const { analyticsDB } = require('../../database');

const screenSizeSchema = new mongoose.Schema({
  size: String,
  count: Number,
});

// Define new location schema
const locationSchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
  count: Number,
  latitude: Number,
  longitude: Number,
});

const trafficDataSchema = new mongoose.Schema({
  date: Date,
  visits: { type: Number, default: 0 },
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  screenSizes: [screenSizeSchema],
  locations: [locationSchema], // Use new location schema instead of IP Addresses
});

const siteSchema = new mongoose.Schema({
  name: String,
  traffic: [trafficDataSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const dailyTotalSchema = new mongoose.Schema({
  date: Date,
  visits: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
  clientId: { type: String, unique: true, required: true },
});

const Site = analyticsDB.model('Site', siteSchema);
const DailyTotal = analyticsDB.model('DailyTotal', dailyTotalSchema);
const User = analyticsDB.model('User', userSchema);

module.exports = {
  Site,
  DailyTotal,
  User,
};
