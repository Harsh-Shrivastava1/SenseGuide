const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio.controller');

// Endpoint: POST /chat (Strict, no trailing slash normally handled by app use)
// Mapped as app.use('/chat', chatRoutes) -> so this is '/'
router.post('/', express.json(), audioController.analyzeAudio);

module.exports = router;
