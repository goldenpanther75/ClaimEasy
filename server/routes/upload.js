const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multistorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the path relative to the server root, which we will serve statically
        const filePath = '/uploads/' + req.file.filename;

        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: filePath,
            originalName: req.file.originalname
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

module.exports = router;
