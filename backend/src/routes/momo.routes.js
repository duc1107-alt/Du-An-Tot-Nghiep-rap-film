const express = require('express');
const router = express.Router();
const { createPayment, momoCallback } = require('../controllers/momo.controller');

router.post('/create', createPayment);
router.post('/callback', express.json(), momoCallback);

module.exports = router;
