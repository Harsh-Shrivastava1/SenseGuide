const express = require('express');
const router = express.Router();
const objectController = require('../controllers/object.controller');
const upload = require('../middleware/upload.middleware');

router.post('/analyze', upload.single('image'), objectController.analyzeObject);

module.exports = router;
