const PersonalInfo = require("../../models/Newprofile/personal");
const Experience = require("../../models/Newprofile/Experience");
const Education = require("../../models/Newprofile/Education");
const JobPreference = require("../../models/Newprofile/Jobpref");
const Summary = require("../../models/Newprofile/summary");
const Language = require("../../models/Newprofile/Language");
const Project = require("../../models/Newprofile/Project");
const Skills = require("../../models/Newprofile/Skills");

exports.getUserProfileData = async (req, res) => {
  try {
     // Determine which user ID to use
     const userId = req.params.id || (req.user && req.user.id);

    // Retrieve personal info
    const personalInfo = await PersonalInfo.findOne({ userId });

    // Retrieve experiences
    const experiences = await Experience.findOne({ userId });

    // Retrieve education details
    const education = await Education.findOne({ userId });

    // Retrieve summary
    const summary = await Summary.findOne({ userId });

    const jobPreference = await JobPreference.findOne({ userId });

    const language = await Language.findOne({ userId });

    const projects = await Project.findOne({ userId });

    const skills = await Skills.findOne({ userId });

    // Combine all available data into one response object
    const userProfile = {};

    if (personalInfo) userProfile.personalInfo = personalInfo;
    if (experiences) userProfile.experiences = experiences.experienceRecords;
    if (education) userProfile.education = education.educationRecords;
    if (summary) userProfile.summary = summary.content;
    if (jobPreference) userProfile.JobPreference = jobPreference;
    if (language) userProfile.language = language.languages;
    if (projects) userProfile.projects = projects.projects;
    if (skills) userProfile.skills = skills.Skills;

    // Return the combined data (even if some sections are missing)
    return res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.checkUserIdExistence = async (req, res) => {
  const userId = req.user.id; // Or req.params depending on how you are passing userId
  const foundSchemas = [];

  try {
    // Check in PersonalInfo schema
    const personalInfo = await PersonalInfo.findOne({ userId });
    if (personalInfo) foundSchemas.push("PersonalInfo");

    // Check in Summary schema
    const summary = await Summary.findOne({ userId });
    if (summary) foundSchemas.push("Summary");

    // Check in Experience schema
    const experience = await Experience.findOne({ userId });
    if (
      experience &&
      Array.isArray(experience.experienceRecords) &&
      experience.experienceRecords.length > 0
    ) {
      foundSchemas.push("Experience");
    }

    // Check in Education schema
    const education = await Education.findOne({ userId });
    if (
      education &&
      Array.isArray(education.educationRecords) &&
      education.educationRecords.length > 0
    ) {
      foundSchemas.push("Education");
    }

    const language = await Language.findOne({ userId });
    if (
      language &&
      Array.isArray(language.languages) &&
      language.languages.length > 0
    ) {
      foundSchemas.push("Language");
    }

    const skills = await Skills.findOne({ userId });
    if (skills && Array.isArray(skills.Skills) && skills.Skills.length > 0) {
      foundSchemas.push("Skills");
    }

    const project = await Project.findOne({ userId });
    if (
      project &&
      Array.isArray(project.projects) &&
      project.projects.length > 0
    ) {
      foundSchemas.push("Projects");
    }

    // Check in JobPreference schema
    const jobPreference = await JobPreference.findOne({ userId });
    if (jobPreference) foundSchemas.push("JobPreference");

    // If the userId is found in any schema, return the list of schema names
    if (foundSchemas.length > 0) {
      return res.status(200).json({ schemas: foundSchemas });
    }

    // If the userId is not found in any schema
    return res.status(404).json({ message: "User ID not found in any schema" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
