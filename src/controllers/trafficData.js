const { Site, DailyTotal } = require('../models/analyticsModel');
const trafficData = async (req, res) => {
  try {
    res.status(200).json({ message: 'Traffic data processed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrafficData = async (req, res) => {
  try {
    const siteName = req.query.siteName;

    if (siteName) {
      const site = await Site.findOne({ name: siteName });

      if (!site) {
        res.status(404).json({ message: 'Site not found.' });
        return;
      }

      res.status(200).json({ trafficData: site.traffic });
    } else {
      const sites = await Site.find();
      const dailyTotals = await DailyTotal.find();

      res.status(200).json({ sites, dailyTotals });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trafficData,
  getTrafficData,
};
