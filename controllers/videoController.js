const Video = require("../models/Video");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addVideo = async (req, res) => {
  try {
    const { title, youtubeId } = req.body;
    if (!title || !youtubeId) {
      return res.status(400).json({ message: "Title and YouTube ID are required" });
    }
    const newVideo = new Video({ title, youtubeId });
    await newVideo.save();
    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add video" });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};

module.exports = { getVideos, addVideo, deleteVideo };