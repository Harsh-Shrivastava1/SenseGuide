const multer = require('multer');
const path = require('path');

// Configure storage (in-memory for simple buffer access, or diskStorage)
// For Azure integration later, buffer is often useful. For MVP, we'll use memory.
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        // Accept images and audio
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and audio files are allowed!'), false);
        }
    }
});

module.exports = upload;
