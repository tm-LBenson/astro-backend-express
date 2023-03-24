const { User } = require('../models/analyticsModel');

const validateClientId = async (req, res, next) => {
  try {
    const clientId = req.header('X-Client-ID');

    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required.' });
    }

    const user = await User.findOne({ clientId });

    if (!user) {
      return res.status(400).json({ message: 'Invalid client ID.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error validating client ID.', error });
  }
};

module.exports = validateClientId;
