const express = require("express");
const router = express.Router();

// Placeholder – add any admin-related auth routes here if needed
// For now, just return a simple message
router.get("/", (req, res) => {
  res.json({ message: "Auth routes placeholder" });
});

module.exports = router;