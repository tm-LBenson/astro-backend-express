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
const { loginUser, registerUser } = require('../controllers/authController');

const authenticateUser = require('../middleware/authMiddleware');
const validateClientID = require('../middleware/validateClientId');
const router = express.Router();

router.route('/').get(proofOfLife);
router.route('/contact').post(contact);
router
  .route('/traffic-data')
  .post(
    validateClientID,
    formatDateMiddleware,
    validateTrafficData,
    incrementVisits,
    incrementDailyTotal,
    handleDeviceType,
    handleScreenSize,
    handleIpAddress,
    trafficData,
  )
  .get(authenticateUser, getTrafficData);
router.post('/login', loginUser);
router.post('/signup', registerUser);
module.exports = router;
