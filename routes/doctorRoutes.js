const express = require("express");
const { getDoctors } = require("../controllers/doctorController");

const router = express.Router();

// Public: get all doctors
router.get("/", getDoctors);

module.exports = router;