// middleware/trafficDataHandlers.js
const { Site, DailyTotal } = require('../models/analyticsModel');

const incrementVisits = async (req, res, next) => {
  try {
    const { siteName, date } = req.body;
    await Site.findOneAndUpdate(
      { name: siteName, 'traffic.date': date },
      { $inc: { 'traffic.$.visits': 1 } },
    );
    next();
  } catch (error) {
    next(error);
  }
};

const incrementDailyTotal = async (req, res, next) => {
  try {
    const { date } = req.body;
    await DailyTotal.updateOne(
      { date },
      { $inc: { total: 1 } },
      { upsert: true },
    );
    next();
  } catch (error) {
    next(error);
  }
};

const handleDeviceType = async (req, res, next) => {
  try {
    const { siteName, date, deviceType } = req.body;
    await Site.findOneAndUpdate(
      { name: siteName, 'traffic.date': date },
      { $inc: { [`traffic.$.deviceTypes.${deviceType}`]: 1 } },
    );
    next();
  } catch (error) {
    next(error);
  }
};

const handleScreenSize = async (req, res, next) => {
  try {
    const { siteName, screenSize } = req.body;
    await Site.updateOne(
      { name: siteName },
      { $inc: { [`screenSizes.${screenSize}`]: 1 } },
    );
    next();
  } catch (error) {
    next(error);
  }
};

const handleIpAddress = async (req, res, next) => {
  try {
    const { siteName, ipAddress } = req.body;
    await Site.updateOne(
      { name: siteName },
      { $addToSet: { ipAddresses: ipAddress } },
    );
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  incrementVisits,
  handleDeviceType,
  handleScreenSize,
  handleIpAddress,
  incrementDailyTotal,
};
