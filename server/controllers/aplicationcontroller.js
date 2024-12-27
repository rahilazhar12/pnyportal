const Application = require("../models/applicationschema"); // Adjust the path according to your structure
const User = require("../models/user.model"); // Adjust this path to where your user model is located
const pnyalumini = require("../models/pnyalumini"); // Adjust this path to where your user model is located
const nodeMailer = require("nodemailer");

const ApplyForJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id; // Assuming the user's ID is attached to req.user by your authentication middleware
  try {
    // Check for existing application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    // Fetch user's details
    let user = await User.findById(userId);
    let pnyaluminiRecord;

    // If user is not found, attempt to find pnyalumini record
    if (!user) {
      pnyaluminiRecord = await pnyalumini.findById(userId);
      if (!pnyaluminiRecord) {
        return res
          .status(404)
          .json({ message: "User or pnyalumini record not found" });
      }
    }

    // Prepare application data
    const applicationData = {
      job: jobId,
      applicant: userId,
      name: user ? user.name : pnyaluminiRecord.name, // Use user if available, otherwise pnyaluminiRecord
      contact: user ? user.contact : pnyaluminiRecord.contact,
      email: user ? user.email : pnyaluminiRecord.email,
      city: user ? user.city : pnyaluminiRecord.city,
      // Adding pnyalumini details as needed
      // pnyaluminiDetails: pnyaluminiRecord ? pnyaluminiRecord.someField : null, // Replace 'someField' with actual field
    };

    // Create the application
    const application = await Application.create(applicationData);

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
