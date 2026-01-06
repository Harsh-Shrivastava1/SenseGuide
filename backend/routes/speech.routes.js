const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio.controller');

// Endpoint: /speech/token
router.get('/token', audioController.getToken);

module.exports = router;
