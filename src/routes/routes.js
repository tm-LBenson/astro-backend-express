const express = require('express');
const proofOfLife = require('../controllers/proofOfLife');
const { trafficData, getTrafficData } = require('../controllers/trafficData');
const contact = require('../controllers/contact');
const validateTrafficData = require('../middleware/validateTrafficData');
const {
  incrementVisits,
  incrementDailyTotal,
  handleDeviceType,
  handleScreenSize,
  handleIpAddress,
} = require('../middleware/trafficDataHandlers');
const formatDateMiddleware = require('../middleware/formatDate');
const router = express.Router();

router.route('/').get(proofOfLife);
router.route('/contact').post(contact);
router
  .route('/traffic-data')
  .post(
    formatDateMiddleware,
    validateTrafficData,
    incrementVisits,
    incrementDailyTotal,
    handleDeviceType,
    handleScreenSize,
    handleIpAddress,
    trafficData,
  )
  .get(getTrafficData);

module.exports = router;
