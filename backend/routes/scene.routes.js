const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/scene.controller');
const upload = require('../middleware/upload.middleware');

router.post('/analyze', upload.single('image'), sceneController.analyzeScene);

module.exports = router;
