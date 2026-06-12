const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");      // add this

// Admin Login Controller
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create default admin if none exists
const createDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: "sjhospital.tpa@gmail.com" });
    if (!existing) {
      const admin = new Admin({
        email: "sjhospital.tpa@gmail.com",
        password: "goodluck@123",
      });
      await admin.save();
      console.log("✅ Default admin created successfully");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};


// Add this to the module.exports at the bottom
const getStats = async (req, res) => {
  try {
    const doctors = await Doctor.countDocuments();
    const gallery = await Gallery?.countDocuments() || 0;
    const careers = await Job?.countDocuments() || 0;   // if Job model exists
    res.json({ doctors, gallery, careers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminLogin, createDefaultAdmin, getStats };


