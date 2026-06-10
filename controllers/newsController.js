const News = require('../models/News');

// Get all active news (sorted by order)
exports.getNews = async (req, res) => {
  try {
    const news = await News.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all news (including inactive)
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ order: 1, createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create news
exports.createNews = async (req, res) => {
  try {
    const { text, order } = req.body;
    const news = new News({ text, order });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update news
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isActive, order } = req.body;
    const news = await News.findByIdAndUpdate(
      id,
      { text, isActive, order },
      { new: true, runValidators: true }
    );
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete news
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};