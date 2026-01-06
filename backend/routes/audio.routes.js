const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio.controller');
const multer = require('multer');
const upload = multer(); // Handle multipart if needed, though chat is JSON

// GET /api/audio/token
router.get('/token', audioController.getToken);

// POST /api/audio/chat - Text in, Text out (Groq)
router.post('/chat', express.json(), audioController.analyzeAudio);

module.exports = router;
