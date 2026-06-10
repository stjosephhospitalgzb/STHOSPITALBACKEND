const ParamedicalGallery = require('../models/ParamedicalGallery');
const { uploadImage } = require('../config/cloudinary');   // reuse your existing Cloudinary helper

// @desc    Get all gallery images (public)
// @route   GET /api/paramedical-gallery
const getGallery = async (req, res) => {
  try {
    const images = await ParamedicalGallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new gallery image (admin only)
// @route   POST /api/paramedical-gallery/admin
const addGalleryImage = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    // Upload to Cloudinary inside folder "paramedical_gallery"
    const result = await uploadImage(req.file.buffer, 'paramedical_gallery');
    
    const newImage = new ParamedicalGallery({
      imageUrl: result.secure_url,
      title,
      category
    });
    await newImage.save();
    
    res.status(201).json({ message: 'Image added successfully', image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add image', error: error.message });
  }
};

// @desc    Delete gallery image (admin only)
// @route   DELETE /api/paramedical-gallery/admin/:id
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await ParamedicalGallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Optional: delete from Cloudinary (extract public_id from imageUrl)
    await image.deleteOne();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};

module.exports = { getGallery, addGalleryImage, deleteGalleryImage };