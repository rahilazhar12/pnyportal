const Jobs = require('../models/postJobs.js');
const Application = require('../models/applicationschema.js')
const fs = require('fs').promises;
const path = require('path'); // to handle file paths correctly


exports.getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Fetch all applications for the specific job, selecting only the applicant information
    const applications = await Application.find({ job: jobId })
      .select('applicant job name city contact email applicationDate');

    // If no applications found
    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this job.' });
    }

    // Return applicant information
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve applications' });
  }
};


exports.getJobsList = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const job = await Jobs.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
      return res.status(200).json({ success: true, job: [job] }); // Wrap in array to keep response consistent
    }

    const jobs = await Jobs.find();
    return res.status(200).json(jobs); // Ensure jobs is always an array
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error fetching jobs", error });
  }
};


exports.Deletejobsandapplication = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if job with the given id exists
    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Delete the picture if the job has a company logo
    if (job.companyLogo) {
      // Adjust this to the correct location of the uploads folder
      const imagePath = path.join(__dirname, '..', 'uploads', job.companyLogo); // Move up one directory from controllers to main project folder
      try {
        await fs.unlink(imagePath); // Delete the image file
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    // Delete the job
    await Jobs.findByIdAndDelete(id);

    // Delete all applications related to the job
    await Application.deleteMany({ job: id });

    return res.status(200).json({ success: true, message: "Job, associated application(s), and picture deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error deleting job, applications, or picture", error });
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { jobTitle, companyName, jobLocation, minPrice, maxPrice, salaryType, experienceLevel, skillsRequired, employmentType, category, description } = req.body;

  try {
    // Check if the job exists
    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Update job details
    job.jobTitle = jobTitle;
    job.companyName = companyName;
    job.jobLocation = jobLocation;
    job.minPrice = minPrice;
    job.maxPrice = maxPrice;
    job.salaryType = salaryType;
    job.experienceLevel = experienceLevel;
    job.skillsRequired = skillsRequired;
    job.employmentType = employmentType;
    job.category = category;
    job.description = description;

    // Save the updated job
    await job.save();

    return res.status(200).json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ success: false, message: "Error updating job", error });
  }
};

exports.searchJobs = async (req, res) => {
  const { jobTitle, jobLocation } = req.query;

  try {
    // Create search conditions
    let searchConditions = {};

    if (jobTitle) {
      searchConditions.jobTitle = { $regex: jobTitle, $options: "i" }; // case-insensitive search
    }

    if (jobLocation) {
      searchConditions.jobLocation = { $regex: jobLocation, $options: "i" };
    }

    // Query the database
    const jobs = await Jobs.find(searchConditions);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching for jobs",
      error,
    });
  }
};


exports.getSuggestions = async (req, res) => {
  const { field, query } = req.query; // field should be either 'jobTitle' or 'jobLocation'

  // Validate inputs
  if (!field || !query) {
    return res.status(400).json({ message: "Field and query are required" });
  }

  // Define the search object based on the field (jobTitle or jobLocation)
  let searchObj = {};
  searchObj[field] = { $regex: `^${query}`, $options: "i" }; // case-insensitive regex for "starts with"

  try {
    // Query database to get unique suggestions
    const suggestions = await Jobs.find(searchObj).limit(10).distinct(field);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suggestions", error });
  }
};



