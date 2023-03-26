// middleware/trafficDataHandlers.js
const { Site, DailyTotal, User } = require('../models/analyticsModel');

const updateSiteData = async (req, res, next) => {
  try {
    const { siteName, date, deviceType, screenSize, ipAddress } = req.body;
    const user = await User.findOne({ username: req.user.username });

    const sizeString = `${screenSize.width}x${screenSize.height}`;

    const site = await Site.findOneAndUpdate(
      { name: siteName, user: user._id, 'traffic.date': date },
      {
        $inc: {
          'traffic.$.visits': 1,
          [`traffic.$.deviceTypes.${deviceType}`]: 1,
        },
        $addToSet: {
          'traffic.$.screenSizes': { size: sizeString, count: 1 },
          'traffic.$.ipAddresses': { address: ipAddress, count: 1 },
        },
      },
      { new: true },
    );

    if (!site) {
      const newSite = new Site({
        name: siteName,
        traffic: [
          {
            date,
            visits: 1,
            deviceTypes: { [deviceType]: 1 },
            screenSizes: [{ size: sizeString, count: 1 }],
            ipAddresses: [{ address: ipAddress, count: 1 }],
          },
        ],
        user: user._id,
      });

      user.sites.push(newSite._id);
      await Promise.all([newSite.save(), user.save()]);
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
      const sites = await Site.find({ _id: { $in: user.sites } });

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
