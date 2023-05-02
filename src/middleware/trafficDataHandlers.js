// middleware/trafficDataHandlers.js
const { Site, DailyTotal, User } = require('../models/analyticsModel');
const { combineDuplicateDates } = require('./combineDuplicateDates ');

const updateSiteData = async (req, res, next) => {
  try {
    const { siteName, date, deviceType, screenSize, ipAddress } = req.body;
    const user = await User.findOne({ username: req.user.username });

    const sizeString = `${screenSize.width}x${screenSize.height}`;

    let site = await Site.findOne({ name: siteName, user: user._id });

    if (!site) {
      site = new Site({
        name: siteName,
        traffic: [],
        user: user._id,
      });
      user.sites.push(site._id);
      await user.save();
    }

    const today = new Date(date).setUTCHours(0, 0, 0, 0);
    const trafficEntry = await Site.findOne({
      name: siteName,
      user: user._id,
      'traffic.date': today,
    });

    if (trafficEntry) {
      const trafficIndex = trafficEntry.traffic.findIndex(
        (entry) => new Date(entry.date).setUTCHours(0, 0, 0, 0) === today,
      );

      const ipIndex = trafficEntry.traffic[trafficIndex].ipAddresses.findIndex(
        (ip) => ip.address === ipAddress,
      );
      const screenSizeIndex = trafficEntry.traffic[
        trafficIndex
      ].screenSizes.findIndex((size) => size.size === sizeString);

      if (ipIndex !== -1) {
        trafficEntry.traffic[trafficIndex].ipAddresses[ipIndex].count += 1;
        trafficEntry.traffic[trafficIndex].visits += 1;
        trafficEntry.traffic[trafficIndex].deviceTypes[deviceType] += 1;

        if (screenSizeIndex !== -1) {
          trafficEntry.traffic[trafficIndex].screenSizes[
            screenSizeIndex
          ].count += 1;
        } else {
          trafficEntry.traffic[trafficIndex].screenSizes.push({
            size: sizeString,
            count: 1,
          });
        }

        await trafficEntry.save();
      } else {
        trafficEntry.traffic[trafficIndex].ipAddresses.push({
          address: ipAddress,
          count: 1,
        });
        trafficEntry.traffic[trafficIndex].screenSizes.push({
          size: sizeString,
          count: 1,
        });
        trafficEntry.traffic[trafficIndex].visits += 1;
        trafficEntry.traffic[trafficIndex].deviceTypes[deviceType] += 1;

        await trafficEntry.save();
      }
    } else {
      site.traffic.push({
        date,
        visits: 1,
        deviceTypes: { [deviceType]: 1 },
        screenSizes: [{ size: sizeString, count: 1 }],
        ipAddresses: [{ address: ipAddress, count: 1 }],
      });
      await site.save();
    }

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
      { $inc: { visits: 1 } },
      { upsert: true },
    );

    next();
  } catch (error) {
    next(error);
  }
};

const getUserSites = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });

    if (user) {
      let sites = await Site.find({ _id: { $in: user.sites } });

      const combinePromises = sites.map((site) => combineDuplicateDates(site));
      await Promise.all(combinePromises);

      res.status(200).json(sites);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user sites.', error });
  }
};

module.exports = {
  updateSiteData,
  incrementDailyTotal,
  getUserSites,
};
