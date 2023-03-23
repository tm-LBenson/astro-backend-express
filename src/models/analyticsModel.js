const mongoose = require('mongoose');

const screenSizeSchema = new mongoose.Schema({
  size: String,
  count: Number,
});

const ipAddressSchema = new mongoose.Schema({
  address: String,
  count: Number,
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
  ipAddresses: [ipAddressSchema],
});

const siteSchema = new mongoose.Schema({
  name: String,
  traffic: [trafficDataSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  clientId: { type: String, unique: true },
});

const Site = mongoose.model('Site', siteSchema);
const DailyTotal = mongoose.model('DailyTotal', dailyTotalSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Site,
  DailyTotal,
  User,
};
