// middleware/validateclientId.js
const { User } = require('../models/analyticsModel');

const validateClientId = async (req, res, next) => {
  try {
    const clientId = req.get('X-Client-ID') || req.body.clientId;

    if (!clientId) {
      return res.status(401).json({ message: 'Client ID is missing' });
    }

    const user = await User.findOne({ clientId });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Client ID' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = validateClientId;
