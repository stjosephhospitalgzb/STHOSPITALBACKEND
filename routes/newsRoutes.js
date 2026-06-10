const express = require('express');
const router = express.Router();
const {
  getNews,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/authMiddleware'); // ✅ use authorize

// Public route
router.get('/', getNews);

// Admin routes – protect + authorize('admin')
router.get('/admin', protect, authorize('admin'), getAllNews);
router.post('/', protect, authorize('admin'), createNews);
router.put('/:id', protect, authorize('admin'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;