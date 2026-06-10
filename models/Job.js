const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { 
    type: String, 
    required: true, 
    enum: ["Medical", "Nursing", "Non-Medical"] 
  },
  type: { type: String, required: true, enum: ["Full Time", "Part Time", "Contract", "Internship"] },
  experience: { type: String, required: true },
  description: { type: String, default: "" },
  category: { 
    type: String, 
    default: "Medical",
    enum: ["Medical", "Nursing", "Non-Medical"]
  },
  postedDate: { type: Date, default: Date.now },
  qualification: { type: String, default: "" },
  vacancies: { type: Number, default: 1, min: 1 },
  location: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);