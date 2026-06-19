const Doctor = require("../models/Doctor");
const { uploadImage } = require("../config/cloudinary");

// PUBLIC: get all doctors (no auth)
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: get single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: add new doctor (with image upload)
const addDoctor = async (req, res) => {
  try {
    const { name, qual, dept, exp, rating, reviews, about, opdTimings, roomNo } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    // Upload to Cloudinary
    const result = await uploadImage(req.file.buffer, "doctors");
    const imgUrl = result.secure_url;

    const doctor = new Doctor({
      name,
      qual,
      dept,
      exp: Number(exp),
      rating: rating ? Number(rating) : 4.5,
      reviews: reviews ? Number(reviews) : 0,
      img: imgUrl,
      about,
      opdTimings,
      roomNo, // ✅ NEW FIELD
    });
    await doctor.save();

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add doctor", error: error.message });
  }
};

// ADMIN: update doctor (optional image)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { name, qual, dept, exp, rating, reviews, about, opdTimings } = req.body;

    doctor.name = name || doctor.name;
    doctor.qual = qual || doctor.qual;
    doctor.dept = dept || doctor.dept;
    doctor.exp = exp ? Number(exp) : doctor.exp;
    doctor.rating = rating ? Number(rating) : doctor.rating;
    doctor.reviews = reviews ? Number(reviews) : doctor.reviews;
    doctor.about = about || doctor.about;
    doctor.opdTimings = opdTimings || doctor.opdTimings;

    // ✅ FIX: update roomNo only if provided
    if (req.body.roomNo !== undefined && req.body.roomNo !== null) {
      doctor.roomNo = req.body.roomNo.trim();
    }

    if (req.file) {
      const result = await uploadImage(req.file.buffer, "doctors");
      doctor.img = result.secure_url;
    }

    await doctor.save();
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update doctor", error: error.message });
  }
};

// ADMIN: delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Optional: delete image from Cloudinary (you can implement using public_id)
    await doctor.deleteOne();
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
};