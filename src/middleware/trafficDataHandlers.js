// middleware/trafficDataHandlers.js
const { Site, DailyTotal } = require('../models/analyticsModel');

const incrementVisits = async (req, res, next) => {
  try {
    const { siteName, date } = req.body;

    let site = await Site.findOne({ name: siteName, 'traffic.date': date });

    if (!site) {
      site = new Site({
        name: siteName,
        traffic: [
          {
            date,
            visits: 1,
            deviceTypes: { desktop: 0, mobile: 0, tablet: 0 },
            screenSizes: [],
            ipAddresses: [],
          },
        ],
      });
    } else {
      const trafficData = site.traffic.find(
        (t) => t.date.toISOString() === date,
      );
      trafficData.visits++;
    }

    await site.save();
    console.log('Updated Site:', site); // Add console.log here
    next();
  } catch (error) {
    next(error);
  }
};

const incrementDailyTotal = async (req, res, next) => {
  try {
    const { date } = req.body;
    const updatedDailyTotal = await DailyTotal.updateOne(
      { date },
      { $inc: { visits: 1 } },
      { upsert: true },
    );
    console.log('Updated DailyTotal:', updatedDailyTotal); // Add console.log here
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
    const { siteName, date, screenSize } = req.body;
    const sizeString = `${screenSize.width}x${screenSize.height}`;

    const site = await Site.findOne({ name: siteName, 'traffic.date': date });

    if (site) {
      const trafficData = site.traffic.find(
        (t) => t.date.toISOString() === date,
      );
      if (trafficData) {
        const screenSizeData = trafficData.screenSizes.find(
          (s) => s.size === sizeString,
        );
        if (screenSizeData) {
          screenSizeData.count++;
        } else {
          trafficData.screenSizes.push({ size: sizeString, count: 1 });
        }
        await site.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const handleIpAddress = async (req, res, next) => {
  try {
    const { siteName, date, ipAddress } = req.body;

    const site = await Site.findOne({ name: siteName, 'traffic.date': date });

    if (site) {
      const trafficData = site.traffic.find(
        (t) => t.date.toISOString() === date,
      );
      if (trafficData) {
        const ipAddressData = trafficData.ipAddresses.find(
          (ip) => ip.address === ipAddress,
        );
        if (ipAddressData) {
          ipAddressData.count++;
        } else {
          trafficData.ipAddresses.push({ address: ipAddress, count: 1 });
        }
        await site.save();
      }
    }

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
