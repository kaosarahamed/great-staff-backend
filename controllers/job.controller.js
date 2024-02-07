const JobModel = require("../models/job.model");

// Get All Jobs
async function getAllJob(req, res) {
  try {
    const data = await JobModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single Jobs
async function getOneJob(req, res) {
  const id = req.params.id;
  const existJob = await JobModel.findOne({ _id: id });
  try {
    if (existJob) {
      res.status(200).json(existJob);
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create Jobs
async function createJob(req, res) {
  const {
    startDate,
    startTime,
    length,
    urgency,
    compensation,
    bonuses,
    employeeID,
    notes,
  } = req.body;
  try {
    const newJob = new JobModel({
      startDate,
      startTime,
      postDate: new Date().getDate(),
      length,
      urgency,
      compensation,
      bonuses,
      notes,
      employeeID,
    });
    await newJob.save();
    res.status(201).json({ newJob, message: "Created Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update Jobs
async function updateJob(req, res) {
  const id = req.params.id;
  const {
    startDate,
    startTime,
    length,
    urgency,
    compensation,
    bonuses,
    employeeID,
    notes,
  } = req.body;
  const existShift = await JobModel.findOne({ _id: id });
  try {
    if (existShift) {
      const updateShift = {
        startDate,
        startTime,
        postDate: new Date().getDate(),
        length,
        urgency,
        compensation,
        bonuses,
        employeeID,
        notes,
      };
      await JobModel.findByIdAndUpdate(id, updateShift, { new: true });
      res.status(200).json({ updateShift, message: "Update Successfull" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Delete Jobs
async function deleteJob(req, res) {
  const id = req.params.id;
  const existJob = await JobModel.findOne({ _id: id });

  try {
    if (existJob) {
      await JobModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Deleted Successful" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getAllJob,
  getOneJob,
  createJob,
  updateJob,
  deleteJob,
};
