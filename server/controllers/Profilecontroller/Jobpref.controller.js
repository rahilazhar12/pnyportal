// controllers/jobPreferenceController.js

const JobPreference = require("../../models/Newprofile/Jobpref");

exports.createJobPreference = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      title,
      salary,
      skills,
      relocation,
      relocationPreference,
      preferredLocations,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !salary ||
      !skills ||
      !Array.isArray(skills) ||
      (relocation &&
        relocationPreference === "Near" &&
        (!preferredLocations || !Array.isArray(preferredLocations)))
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Create new JobPreference
    const newJobPreference = new JobPreference({
      title,
      salary,
      skills,
      relocation,
      userId: userId,
      relocationPreference: relocation ? relocationPreference : "",
      preferredLocations:
        relocation && relocationPreference === "Near" ? preferredLocations : [],
    });

    const savedJobPreference = await newJobPreference.save();
    res.status(201).json(savedJobPreference);
  } catch (error) {
    console.error("Error creating job preference:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a job preference by ID
// @route   GET /api/jobPreferences/:id
// @access  Public (or Protected)
exports.getJobPreferenceByUser = async (req, res) => {
  const userId = req.user.id; // Ensure req.user is populated via auth middleware

  const jobPreference = await JobPreference.findOne({ userId: userId });

  if (!jobPreference) {
    return res.status(404).json({ message: "Job Preference not found" });
  }

  res.json(jobPreference);
};

// @desc    Update a job preference by ID
// @route   PUT /api/jobPreferences/:id
// @access  Public (or Protected)
exports.updateJobPreference = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      title,
      salary,
      skills,
      relocation,
      relocationPreference,
      preferredLocations,
    } = req.body;

    const user = await JobPreference.findOne({ userId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User's education records not found" });
    }

    // Find existing job preference
    let jobPreference = await JobPreference.findById(req.params.id);
    if (!jobPreference) {
      return res.status(404).json({ message: "Job Preference not found" });
    }

    // Update fields
    jobPreference.title = title || jobPreference.title;
    jobPreference.salary = salary || jobPreference.salary;
    jobPreference.skills =
      Array.isArray(skills) && skills.length > 0
        ? skills
        : jobPreference.skills;
    jobPreference.relocation =
      relocation !== undefined ? relocation : jobPreference.relocation;
    jobPreference.relocationPreference = relocation
      ? relocationPreference || jobPreference.relocationPreference
      : "";
    jobPreference.preferredLocations =
      relocation && relocationPreference === "Near"
        ? preferredLocations || jobPreference.preferredLocations
        : "";

    const updatedJobPreference = await jobPreference.save();
    res.json(updatedJobPreference);
  } catch (error) {
    console.error("Error updating job preference:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a job preference by ID
// @route   DELETE /api/jobPreferences/:id
// @access  Public (or Protected)
exports.deleteJobPreference = async (req, res) => {
  try {
    const jobPreference = await JobPreference.findById(req.params.id);
    if (!jobPreference) {
      return res.status(404).json({ message: "Job Preference not found" });
    }

    await jobPreference.remove();
    res.json({ message: "Job Preference removed" });
  } catch (error) {
    console.error("Error deleting job preference:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all job preferences
// @route   GET /api/jobPreferences
// @access  Public (or Protected)
exports.getAllJobPreferences = async (req, res) => {
  try {
    const jobPreferences = await JobPreference.find().sort({ createdAt: -1 });
    res.json(jobPreferences);
  } catch (error) {
    console.error("Error fetching job preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
};
