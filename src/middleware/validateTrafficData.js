// middleware/validateTrafficData.js
const validDeviceTypes = ['desktop', 'mobile', 'tablet'];

const validateTrafficData = (req, res, next) => {
  const { siteName, date, deviceType, screenSize, ipAddress } = req.body;

  if (!siteName || typeof siteName !== 'string') {
    return res.status(400).json({ message: 'Invalid site name.' });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Invalid date.' });
  }

  if (!deviceType || !validDeviceTypes.includes(deviceType)) {
    return res.status(400).json({ message: 'Invalid device type.' });
  }

  if (!screenSize || typeof screenSize !== 'string') {
    return res.status(400).json({ message: 'Invalid screen size.' });
  }

  if (!ipAddress || typeof ipAddress !== 'string') {
    return res.status(400).json({ message: 'Invalid IP address.' });
  }

  next();
};

module.exports = validateTrafficData;
