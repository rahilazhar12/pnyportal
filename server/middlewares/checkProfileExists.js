const PersonalInfo = require("../models/Newprofile/personal");
const Experience = require("../models/Newprofile/Experience");
const Education = require("../models/Newprofile/Education");
const Summary = require("../models/Newprofile/summary");
const JobPreference = require("../models/Newprofile/Jobpref");
const Language = require("../models/Newprofile/Language");
const Project = require("../models/Newprofile/Project");
const Skills = require("../models/Newprofile/Skills");

const checkProfileComplete = async (req, res, next) => {
  try {
    const userId = req.user.id; // Ensure req.user is populated by authentication middleware

    // Retrieve documents from each schema
    const [
      personalInfo,
      experience,
      education,
      summary,
      jobPreference,
      language,
      projects,
      skills,
    ] = await Promise.all([
      PersonalInfo.findOne({ userId }),
      Experience.findOne({ userId }),
      Education.findOne({ userId }),
      Summary.findOne({ userId }),
      JobPreference.findOne({ userId }),
      Language.findOne({ userId }),
      Project.findOne({ userId }),
      Skills.findOne({ userId }),
    ]);

    // Check if user does not exist in any one of the schema
    if (
      !personalInfo ||
      !experience ||
      !education ||
      !summary ||
      !jobPreference ||
      !language ||
      !projects ||
      !skills
    ) {
      return res.status(400).json({
        message: "Please create a complete profile before applying for jobs.",
      });
    }

    // If user exists in all schemas, proceed
    next();
  } catch (error) {
    console.error("Profile completeness check error:", error);
    return res
      .status(500)
      .json({ message: "Server error while checking profile completeness." });
  }
};

module.exports = checkProfileComplete;
