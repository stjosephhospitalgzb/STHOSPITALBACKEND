const express = require("express");
const { adminLogin, getStats } = require("../controllers/adminController");
const {
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { addVideo, deleteVideo } = require("../controllers/videoController");
const { addGalleryImage, deleteGalleryImage } = require("../controllers/galleryController");
const {
  getJobById,
  addJob,
  updateJob,
  deleteJob,          // ✅ added missing deleteJob
} = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Public route
router.post("/login", adminLogin);

// Protected admin routes
router.get("/stats", protect, authorize("admin"), getStats);

// Doctors
router.get("/doctors/:id", protect, authorize("admin"), getDoctorById);
router.post("/doctors", protect, authorize("admin"), upload.single("image"), addDoctor);
router.put("/doctors/:id", protect, authorize("admin"), upload.single("image"), updateDoctor);
router.delete("/doctors/:id", protect, authorize("admin"), deleteDoctor);

// Gallery
router.post("/gallery", protect, authorize("admin"), upload.single("image"), addGalleryImage);
router.delete("/gallery/:id", protect, authorize("admin"), deleteGalleryImage);

// Jobs
router.get("/jobs/:id", protect, authorize("admin"), getJobById);
router.post("/jobs", protect, authorize("admin"), addJob);
router.put("/jobs/:id", protect, authorize("admin"), updateJob);
router.delete("/jobs/:id", protect, authorize("admin"), deleteJob);

// Videos
router.post("/videos", protect, authorize("admin"), addVideo);
router.delete("/videos/:id", protect, authorize("admin"), deleteVideo);

module.exports = router;