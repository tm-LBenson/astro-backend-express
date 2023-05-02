const { User, Site } = require('../../models/analyticsModel');
const { combineDuplicateDates } = require('../combineDuplicateDates ');

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
module.exports = { getUserSites };
