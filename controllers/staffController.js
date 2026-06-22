const Staff = require("../models/Staff");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(400).json({ message: "Staff account not found" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: staff._id, email: staff.email, role: "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Staff login successful",
      token,
      staff: { id: staff._id, email: staff.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createDefaultStaff = async () => {
  try {
    const existing = await Staff.findOne({ email: "sjhospital.staff@gmail.com" });
    if (!existing) {
      const staff = new Staff({
        email: "sjhospital.staff@gmail.com",
        password: "staffpass@123",
      });
      await staff.save();
      console.log("✅ Default staff created successfully (sjhospital.staff@gmail.com)");
    }
  } catch (err) {
    console.error("Error creating default staff:", err);
  }
};

const setDoctorLeaveStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isOnLeave, startDate, endDate, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor record not found" });

    doctor.isOnLeave = isOnLeave;

    if (isOnLeave) {
      doctor.leaveDetails = {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        reason: reason || "",
        updatedBy: req.user.id,
        updatedAt: new Date(),
      };
    } else {
      doctor.leaveDetails = undefined; // Clears object structure fields out completely
    }

    await doctor.save();
    res.json({ message: "Doctor management status updated successfully", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error changing leave parameters" });
  }
};

module.exports = { staffLogin, createDefaultStaff, setDoctorLeaveStatus };