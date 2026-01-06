const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const sceneController = require('../controllers/scene.controller');
const objectController = require('../controllers/object.controller');
const textController = require('../controllers/text.controller');

// Endpoints: /vision/scene, /vision/object, /vision/text
router.post('/scene', upload.single('image'), sceneController.analyzeScene);
router.post('/object', upload.single('image'), objectController.analyzeObject);
router.post('/text', upload.single('image'), textController.analyzeText);

module.exports = router;
