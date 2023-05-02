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

const router = express.Router();

router.route('/').get(proofOfLife);
router.route('/contact').post(contact);
router
  .route('/traffic-data')
  .post(
    validateClientId,
    formatDateMiddleware,
    validateTrafficData,
    updateSiteData,
    deleteDuplicateSites,
    trafficData,
  )
  .get(authenticateUser, getTrafficData);
router.get('/user-sites', authenticateUser, getUserSites);
router.post('/login', loginUser);
router.post('/signup', registerUser);
module.exports = router;
