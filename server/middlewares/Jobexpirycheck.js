const Job = require("../models/postJobs"); // Ensure correct path to Job model

const checkJobExpiry = async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the job is expired
    const currentDate = new Date();
    if (new Date(job.expirationDate) < currentDate) {
      return res.status(400).json({ message: "This job is no longer available." });
    }

    next(); // Job is still valid, proceed to the next middleware/controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking job expiry." });
  }
};

module.exports = checkJobExpiry;
