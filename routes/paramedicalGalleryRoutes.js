const express = require('express');
const multer = require('multer');
const { getGallery, addGalleryImage, deleteGalleryImage } = require('../controllers/paramedicalGalleryController');
const { adminAuth } = require('../middleware/authMiddleware'); // your existing admin middleware

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route
router.get('/', getGallery);

// Admin routes (protected)
router.post('/admin', adminAuth, upload.single('image'), addGalleryImage);
router.delete('/admin/:id', adminAuth, deleteGalleryImage);

module.exports = router;