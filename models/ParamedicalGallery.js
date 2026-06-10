const mongoose = require('mongoose');

const paramedicalGallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },   // Cloudinary secure URL
  title: { type: String, required: true },      // e.g., "Campus View"
  category: { 
    type: String, 
    required: true,
    enum: ['Institute', 'Lab', 'Events']        // matches frontend filter tabs
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParamedicalGallery', paramedicalGallerySchema);