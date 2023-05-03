const axios = require('axios');

const validDeviceTypes = ['desktop', 'mobile', 'tablet'];

const getLocationData = async (ipAddress) => {
  try {
    const response = await axios(`https://ipapi.co/${ipAddress}/json/`);
    const data = await response.data.json();

    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
    };
  } catch (error) {
    console.error('Error getting location data: ', error);
    return null;
  }
};

const validateTrafficData = async (req, res, next) => {
  const {
    siteName,
    date,
    deviceType,
    screenSize,
    location,
    ipAddress,
    noConsent,
  } = req.body;
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

  if ((location && ipAddress) || (!location && !ipAddress)) {
    console.error({ message: 'Invalid location or IP address.' });
    return res.status(400).json({ message: 'Invalid location or IP address.' });
  }

  if (ipAddress && typeof ipAddress === 'string') {
    req.body.location = await getLocationData(ipAddress);
  }

  next();
};

module.exports = validateTrafficData;
