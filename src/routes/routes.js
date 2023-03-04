/** @format */

const express = require('express');
const proofOfLife = require('../controllers/proofOfLife');
const router = express.Router();

router.route('/').get(proofOfLife);

module.exports = router;
