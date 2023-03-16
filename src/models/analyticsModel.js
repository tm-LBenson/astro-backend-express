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
});

const dailyTotalSchema = new mongoose.Schema({
  date: Date,
  visits: { type: Number, default: 0 },
});

const Site = mongoose.model('Site', siteSchema);
const DailyTotal = mongoose.model('DailyTotal', dailyTotalSchema);

module.exports = {
  Site,
  DailyTotal,
};
