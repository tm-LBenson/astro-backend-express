// middleware/trafficDataHandlers.js
const { Site, DailyTotal, User } = require('../models/analyticsModel');

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

    const trafficEntry = await Site.findOneAndUpdate(
      {
        _id: site._id,
        'traffic.date': date,
        'traffic.ipAddresses.address': ipAddress,
      },
      {
        $inc: {
          'traffic.$.visits': 1,
          [`traffic.$.deviceTypes.${deviceType}`]: 1,
          'traffic.$[ip].count': 1,
        },
      },
      {
        arrayFilters: [{ 'ip.address': ipAddress }],
        new: true,
      },
    );

    if (!trafficEntry) {
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
