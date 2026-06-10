const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeId: { type: String, required: true }, // only the 11-character ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", videoSchema);