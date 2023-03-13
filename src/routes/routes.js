/** @format */

const express = require('express');
const proofOfLife = require('../controllers/proofOfLife');
const router = express.Router();
const contact = require('../controllers/contact');
router.route('/').get(proofOfLife);

router.route('/contact').post(contact);

module.exports = router;
