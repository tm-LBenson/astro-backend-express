const validDeviceTypes = ['desktop', 'mobile', 'tablet'];
const validateTrafficData = (req, res, next) => {
  const { siteName, date, deviceType, screenSize, location, noConsent } =
    req.body;
  console.log(noConsent);
  if (!siteName || typeof siteName !== 'string') {
    console.error({ message: 'Invalid site name.' });
    return res.status(400).json({ message: 'Invalid site name.' });
  }

  if (!date || isNaN(Date.parse(date))) {
    console.error({ message: 'Invalid date.' });
    return res.status(400).json({ message: 'Invalid date.' });
  }

  if (noConsent) {
    return next();
  }

  if (!deviceType || !validDeviceTypes.includes(deviceType)) {
    console.error({ message: 'Invalid device type.' });
    return res.status(400).json({ message: 'Invalid device type.' });
  }

  if (!screenSize || typeof screenSize.width !== 'number') {
    console.error({ message: 'Invalid screen size.' });
    return res.status(400).json({ message: 'Invalid screen size.' });
  }

  if (!location || typeof location !== 'object') {
    console.error({ message: 'Invalid location.' });
    return res.status(400).json({ message: 'Invalid location.' });
  }

  next();
};

module.exports = validateTrafficData;
