// middleware/trafficDataHandlers.js
const { Site, DailyTotal, User } = require('../models/analyticsModel');

const updateSiteData = async (req, res, next) => {
  try {
    const { siteName, date, deviceType, screenSize, ipAddress } = req.body;
    const user = await User.findOne({ username: req.user.username });

    let site = await Site.findOne({ name: siteName, user: user._id });

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
        user: user._id,
      });

      user.sites.push(site._id);
    } else {
      const trafficData = site.traffic.find(
        (t) => t.date.toISOString().split('T')[0] === date,
      );

      if (trafficData) {
        trafficData.visits++;
        trafficData.deviceTypes[deviceType]++;

        const screenSizeData = trafficData.screenSizes.find(
          (s) => s.size === screenSize,
        );
        if (screenSizeData) {
          screenSizeData.count++;
        } else {
          trafficData.screenSizes.push({ size: screenSize, count: 1 });
        }

        const ipAddressData = trafficData.ipAddresses.find(
          (ip) => ip.address === ipAddress,
        );
        if (ipAddressData) {
          ipAddressData.count++;
        } else {
          trafficData.ipAddresses.push({ address: ipAddress, count: 1 });
        }
      } else {
        site.traffic.push({
          date,
          visits: 1,
          deviceTypes: { [deviceType]: 1 },
          screenSizes: [{ size: screenSize, count: 1 }],
          ipAddresses: [{ address: ipAddress, count: 1 }],
        });
      }
    }

    await site.save();
    await user.save();

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
