const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qual: { type: String, required: true },
  dept: { type: String, required: true },
  exp: { type: Number, required: true }, // years
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  img: { type: String, required: true }, // Cloudinary URL
  about: { type: String, required: true },
  opdTimings: { type: String, required: true },
  roomNo: { type: String, required: true } // ✅ NEW FIELD - Room Number
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);