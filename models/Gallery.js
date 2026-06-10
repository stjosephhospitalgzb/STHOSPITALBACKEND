const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // Cloudinary URL
  label: { type: String, required: true },
  category: { type: String, required: true, enum: ["Facilities", "Departments", "Patient Care", "Events", "Community"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gallery", gallerySchema);