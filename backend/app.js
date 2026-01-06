const express = require('express');
const cors = require('cors');

// Import Routes
const visionRoutes = require('./routes/vision.routes');
const speechRoutes = require('./routes/speech.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/vision', visionRoutes); // /vision/scene, /vision/object, /vision/text
app.use('/speech', speechRoutes); // /speech/token
app.use('/chat', chatRoutes);     // /chat

// Health Check
app.get('/', (req, res) => {
    res.send('SenseGuide Backend is running');
});

module.exports = app;
