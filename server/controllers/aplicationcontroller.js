const Application = require("../models/applicationschema"); // Adjust the path according to your structure
const User = require("../models/user.model"); // Adjust this path to where your user model is located
const pnyalumini = require("../models/pnyalumini"); // Adjust this path to where your user model is located
const nodeMailer = require("nodemailer");
const Job = require('../models/postJobs')

// const ApplyForJob = async (req, res) => {
//   const { jobId } = req.params;
//   const userId = req.user.id; // Assuming the user's ID is attached to req.user by your authentication middleware

//   try {
//     // Check if the job exists and if it has expired
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found." });
//     }

//     // Check if the job is expired
//     const currentDate = new Date();
//     if (new Date(job.expirationDate) < currentDate) {
//       return res.status(400).json({ message: "This job is no longer available." });
//     }

//     // Check for existing application
//     const existingApplication = await Application.findOne({
//       job: jobId,
//       applicant: userId,
//     });
//     if (existingApplication) {
//       return res.status(400).json({ message: "You have already applied for this job." });
//     }

//     // Fetch user's details
//     let user = await User.findById(userId);
//     let pnyaluminiRecord;

//     // If user is not found, attempt to find pnyalumini record
//     if (!user) {
//       pnyaluminiRecord = await pnyalumini.findById(userId);
//       if (!pnyaluminiRecord) {
//         return res.status(404).json({ message: "User or pnyalumini record not found" });
//       }
//     }

//     // Prepare application data
//     const applicationData = {
//       job: jobId,
//       applicant: userId,
//       name: user ? user.name : pnyaluminiRecord.name, // Use user if available, otherwise pnyaluminiRecord
//       contact: user ? user.contact : pnyaluminiRecord.contact,
//       email: user ? user.email : pnyaluminiRecord.email,
//       city: user ? user.city : pnyaluminiRecord.city,
//     };

//     // Create the application
//     const application = await Application.create(applicationData);

//     res.status(201).json({
//       success: true,
//       message: "Application submitted successfully",
//       application,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to apply for job" });
//   }
// }

const ApplyForJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id; // Assuming authentication middleware attaches user to request

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the job is expired
    const currentDate = new Date();
    if (new Date(job.expirationDate) < currentDate) {
      return res.status(400).json({ message: "This job is no longer available." });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Fetch user's details
    let user = await User.findById(userId);
    let pnyaluminiRecord;

    if (!user) {
      pnyaluminiRecord = await pnyalumini.findById(userId);
      if (!pnyaluminiRecord) {
        return res.status(404).json({ message: "User or pnyalumini record not found" });
      }
    }

    // Prepare application data
    const applicationData = {
      job: jobId,
      applicant: userId,
      name: user ? user.name : pnyaluminiRecord.name,
      contact: user ? user.contact : pnyaluminiRecord.contact,
      email: user ? user.email : pnyaluminiRecord.email,
      city: user ? user.city : pnyaluminiRecord.city,
    };

    // Create the application
    const application = await Application.create(applicationData);

    // Update user's application count and store applied job ID
    if (user) {
      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { applicationsCount: 1 }, // Increment application count
          $addToSet: { appliedJobs: jobId }, // Add jobId if not already there
        },
        { new: true }
      );
    } else if (pnyaluminiRecord) {
      await pnyalumini.findByIdAndUpdate(
        userId,
        {
          $inc: { applicationsCount: 1 },
          $addToSet: { appliedJobs: jobId },
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};


module.exports = { ApplyForJob };
