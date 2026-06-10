const Gallery = require("../models/Gallery");
const { uploadImage } = require("../config/cloudinary");

// Public: get all gallery images
const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: add new gallery image
const addGalleryImage = async (req, res) => {
  try {
    const { label, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    if (!label || !category) return res.status(400).json({ message: "Label and category are required" });

    const result = await uploadImage(req.file.buffer, "gallery");
    const newImage = new Gallery({
      imageUrl: result.secure_url,
      label,
      category,
    });
    await newImage.save();
    res.status(201).json({ message: "Image added successfully", image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add image", error: error.message });
  }
};

// Admin: delete gallery image
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    // Optional: delete from Cloudinary (you can extract public_id)
    await image.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

module.exports = { getGallery, addGalleryImage, deleteGalleryImage };