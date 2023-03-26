const { User, Site } = require('../models/analyticsModel');

const deleteDuplicateSites = async (req, res, next) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });

    if (user) {
      const sites = await Site.find({ user: user._id });
      const duplicateSites = {};

      sites.forEach((site) => {
        if (duplicateSites[site.name]) {
          duplicateSites[site.name].push(site);
        } else {
          duplicateSites[site.name] = [site];
        }
      });

      Object.keys(duplicateSites).forEach(async (siteName) => {
        if (duplicateSites[siteName].length > 1) {
          const sortedSites = duplicateSites[siteName].sort((a, b) => {
            const totalVisitsA = a.traffic.reduce(
              (sum, entry) => sum + entry.visits,
              0,
            );
            const totalVisitsB = b.traffic.reduce(
              (sum, entry) => sum + entry.visits,
              0,
            );

            return totalVisitsA - totalVisitsB;
          });

          const siteToDelete = sortedSites.shift();
          await Site.deleteOne({ _id: siteToDelete._id });
          user.sites = user.sites.filter(
            (siteId) => !siteId.equals(siteToDelete._id),
          );
          await user.save();
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = deleteDuplicateSites;
