const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller');
const upload = require('../middleware/upload.middleware');

router.post('/analyze', upload.single('image'), textController.analyzeText);

module.exports = router;
