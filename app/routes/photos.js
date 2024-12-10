const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');

// Multer Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images and Videos Only!');
        }
    }
});

// Upload Multiple Photos/Videos
router.post('/upload', [auth, upload.array('files', 10)], async (req, res) => {
    try {
        const files = req.files;
        const { album } = req.body;

        let photos = [];
        for (let file of files) {
            let photo = new Photo({
                user: req.user.id,
                fileUrl: `/uploads/${file.filename}`,
                album: album || 'Default Album',
            });
            await photo.save();
            photos.push(photo);
        }

        res.json({ photos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Photos for User
router.get('/', auth, async (req, res) => {
    try {
        const photos = await Photo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ photos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Download Photo/Video
router.get('/download/:id', auth, async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ msg: 'Photo not found' });

        res.download(path.join(__dirname, '..', photo.fileUrl));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create Album
router.post('/album', auth, async (req, res) => {
    try {
        const { albumName } = req.body;
        // For simplicity, albums are strings. Alternatively, create a separate Album model.
        res.json({ msg: `Album "${albumName}" created` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add Comment to a Photo
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ msg: 'Photo not found' });

        const newComment = {
            user: req.user.id,
            comment,
        };

        photo.comments.unshift(newComment);
        await photo.save();

        res.json(photo.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
