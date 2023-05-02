const { Site, User } = require('../../models/analyticsModel');

const updateSiteData = async (req, res, next) => {
  console.log('updateSiteData');
  try {
    const { siteName, date, deviceType, screenSize, location, noConsent } =
      req.body;

    const user = await User.findOne({ username: req.user.username });
    console.log(noConsent);
    const sizeString = noConsent
      ? ''
      : `${screenSize.width}x${screenSize.height}`;

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
    let trafficIndex = site.traffic.findIndex(
      (entry) => new Date(entry.date).setUTCHours(0, 0, 0, 0) === today,
    );

    if (trafficIndex === -1) {
      site.traffic.push({
        date,
        visits: 0,
        deviceTypes: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
        screenSizes: [],
        locations: [],
      });
      await site.save();
      site = await Site.findOne({ name: siteName, user: user._id });
      trafficIndex = site.traffic.findIndex(
        (entry) => new Date(entry.date).setUTCHours(0, 0, 0, 0) === today,
      );
    }

    site.traffic[trafficIndex].visits += 1;

    if (!noConsent) {
      const locationIndex = site.traffic[trafficIndex].locations.findIndex(
        (loc) =>
          loc.city === location.city &&
          loc.region === location.region &&
          loc.country === location.country,
      );
      const screenSizeIndex = site.traffic[trafficIndex].screenSizes.findIndex(
        (size) => size.size === sizeString,
      );

      site.traffic[trafficIndex].deviceTypes[deviceType] += 1;

      if (screenSizeIndex !== -1) {
        site.traffic[trafficIndex].screenSizes[screenSizeIndex].count += 1;
      } else {
        site.traffic[trafficIndex].screenSizes.push({
          size: sizeString,
          count: 1,
        });
      }

      if (locationIndex !== -1) {
        site.traffic[trafficIndex].locations[locationIndex].count += 1;
      } else {
        site.traffic[trafficIndex].locations.push({
          ...location,
          count: 1,
        });
      }
    }

    await site.save();
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateSiteData,
};
