require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const { createDefaultAdmin } = require("./controllers/adminController");
const app = express();

// Middleware
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/doctors", require("./routes/doctorRoutes"));       // public
app.use("/api/admin", require("./routes/adminRoutes.js"));       // admin
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
// existing routes ...
app.use("/api/paramedical-gallery", require("./routes/paramedicalGalleryRoutes"));

connectDB();
createDefaultAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));