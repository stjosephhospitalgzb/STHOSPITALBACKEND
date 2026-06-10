const express = require("express");
const { adminLogin } = require("../controllers/adminController");
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
  deleteJob,
} = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/doctors/:id", protect, authorize("admin"), getDoctorById);
router.post("/doctors", protect, authorize("admin"), upload.single("image"), addDoctor);
router.put("/doctors/:id", protect, authorize("admin"), upload.single("image"), updateDoctor);
router.delete("/doctors/:id", protect, authorize("admin"), deleteDoctor);
router.post("/gallery", protect, authorize("admin"), upload.single("image"), addGalleryImage);
router.delete("/gallery/:id", protect, authorize("admin"), deleteGalleryImage);
router.get("/jobs/:id", protect, authorize("admin"), getJobById);
router.post("/jobs", protect, authorize("admin"), addJob);
router.put("/jobs/:id", protect, authorize("admin"), updateJob);
router.delete("/jobs/:id", protect, authorize("admin"), deleteJob);
router.post("/videos", protect, authorize("admin"), addVideo);
router.delete("/videos/:id", protect, authorize("admin"), deleteVideo);
module.exports = router;