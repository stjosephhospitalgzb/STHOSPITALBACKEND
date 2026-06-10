const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addJob = async (req, res) => {
  try {
    const {
      title, department, type, experience, description,
      category, qualification, vacancies, location
    } = req.body;
    
    if (!title || !department || !type || !experience) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const job = new Job({
      title, department, type, experience, description,
      category: category || "Medical",
      qualification: qualification || "",
      vacancies: vacancies || 1,
      location: location || "",
      postedDate: new Date()
    });
    
    await job.save();
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    const {
      title, department, type, experience, description,
      category, qualification, vacancies, location
    } = req.body;
    
    job.title = title || job.title;
    job.department = department || job.department;
    job.type = type || job.type;
    job.experience = experience || job.experience;
    job.description = description || job.description;
    job.category = category || job.category;
    job.qualification = qualification || job.qualification;
    job.vacancies = vacancies || job.vacancies;
    job.location = location || job.location;
    job.updatedAt = Date.now();
    
    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

module.exports = { getJobs, getJobById, addJob, updateJob, deleteJob };