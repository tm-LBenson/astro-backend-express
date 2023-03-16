const express = require('express');
const proofOfLife = require('../controllers/proofOfLife');
const trafficData = require('../controllers/trafficData');
const contact = require('../controllers/contact');
const validateTrafficData = require('../middleware/validateTrafficData');
const {
  incrementVisits,
  incrementDailyTotal,
  handleDeviceType,
  handleScreenSize,
  handleIpAddress,
} = require('../middleware/trafficDataHandlers');
const router = express.Router();

router.route('/').get(proofOfLife);
router.route('/contact').post(contact);
router
  .route('/traffic-data')
  .post(
    validateTrafficData,
    incrementVisits,
    incrementDailyTotal,
    handleDeviceType,
    handleScreenSize,
    handleIpAddress,
    trafficData,
  );

module.exports = router;
