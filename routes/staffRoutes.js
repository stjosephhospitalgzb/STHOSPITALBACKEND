const express = require("express");
const router = express.Router();
const { staffLogin, setDoctorLeaveStatus } = require("../controllers/staffController");

// 🟢 CHANGE THIS LINE: Point to authMiddleware instead of auth
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/login", staffLogin);
router.patch("/doctor-leave/:doctorId", protect, authorize("admin", "staff"), setDoctorLeaveStatus);

module.exports = router;