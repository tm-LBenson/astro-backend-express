const express = require('express');
const proofOfLife = require('../controllers/proofOfLife');
const { trafficData, getTrafficData } = require('../controllers/trafficData');
const contact = require('../controllers/contact');
const validateTrafficData = require('../middleware/validateTrafficData');

const formatDateMiddleware = require('../middleware/formatDate');
const { loginUser, registerUser } = require('../controllers/authController');

const authenticateUser = require('../middleware/authMiddleware');
const validateClientId = require('../middleware/validateClientId');
const deleteDuplicateSites = require('../middleware/deleteDuplicateSites');
const {
  getUserSites,
} = require('../middleware/trafficDataHandlers/getUserSites');
const {
  updateSiteData,
} = require('../middleware/trafficDataHandlers/updateSiteData');
const slackMessage = require('../controllers/slackMessage');
const weatherHandler = require('../controllers/weatherHandler');
const summarySheet = require('../controllers/summarySheet');
const checkForID = require('../middleware/summarySheets/checkForID');
const updateClassData = require('../middleware/summarySheets/updateClassData');

const router = express.Router();

router.route('/').get(proofOfLife);
router.route('/weather').get(weatherHandler);
router.route('/contact').post(contact);
router.route('/slack-message').post(slackMessage);
router
  .route('/traffic-data')
  .post(
    validateClientId,
    formatDateMiddleware,
    validateTrafficData,
    updateSiteData,
    deleteDuplicateSites,
    trafficData
  )
  .get(authenticateUser, getTrafficData);
router.get('/user-sites', authenticateUser, getUserSites);
router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/summary-sheets', checkForID, updateClassData, summarySheet);
module.exports = router;
