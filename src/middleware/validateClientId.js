// middleware/validateclientID.js
const { User } = require('../models/analyticsModel');

const validateclientID = async (req, res, next) => {
  try {
    const clientID = req.get('X-Client-ID') || req.body.clientId;

    if (!clientID) {
      return res.status(401).json({ message: 'Client ID is missing' });
    }

    const user = await User.findOne({ clientID });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Client ID' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = validateclientID;
