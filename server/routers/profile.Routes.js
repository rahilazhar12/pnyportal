const express = require("express");
const { requireAuth } = require("../middlewares/requiredauth.js");
const {
  saveSummary,
  getSummariesByUserId,
  updateSummary,
} = require("../controllers/Profilecontroller/profile.controller");
const {
  savePersonalInfo,
  getPersonalInfoByUserId,
  updatePersonalInfo,
} = require("../controllers/Profilecontroller/personal.controller");

const upload = require("../multer/imgConfig");
const {
  createExperience,
  getExperience,
  updateExperienceRecord,
  deleteExperienceRecord,
} = require("../controllers/Profilecontroller/experience.controller");
const {
  createEducation,
  getEducation,
  updateEducationRecord,
  deleteEducationRecord,
} = require("../controllers/Profilecontroller/education.controller.js");
const {
  getUserProfileData,
  checkUserIdExistence,
} = require("../controllers/Profilecontroller/combine.controller.js");
const {
  createJobPreference,
  updateJobPreference,
  deleteJobPreference,
  getJobPreferenceByUser,
} = require("../controllers/Profilecontroller/Jobpref.controller.js");
const {
  createProject,
  getProjects,
  editProject,
  deleteProject,
} = require("../controllers/Profilecontroller/projectController.js");
const {
  addLanguages,
  getLanguages,
  updateLanguages,
  deleteLanguage,
} = require("../controllers/Profilecontroller/language.controller.js");
const {
  addSkills,
  getSkills,
  updateSkills,
  deleteSkill,
} = require("../controllers/Profilecontroller/Skills.controller.js");

const router = express.Router();

// Personal Section Routes Start
router.post(
  "/personal",
  upload.single("profilePicture"),
  requireAuth,
  savePersonalInfo
); // Save personal info
router.get("/personal", requireAuth, getPersonalInfoByUserId); // Get personal info by user ID
router.put(
  "/updatepersonal",
  upload.single("profilePicture"),
  updatePersonalInfo
); // Update personal info
// Personal Section Routes End

// Summary Section Routes Start
router.post("/summary", requireAuth, saveSummary);
router.get("/getsummary", requireAuth, getSummariesByUserId);
router.put("/updatesummary", requireAuth, updateSummary);

// Summary Section Routes End

// Experience Section Routes Start
router.post("/experience", requireAuth, createExperience);

// Get all experience records
router.get("/experience", requireAuth, getExperience);

// Edit an experience record by ID
router.put("/experience/:recordId", requireAuth, updateExperienceRecord);

// Delete an experience record by ID
router.delete(
  "/experience/:experienceRecordId",
  requireAuth,
  deleteExperienceRecord
);
// Experience Section Routes End

// Create education detail
router.post("/education", requireAuth, createEducation);

// Get all education details
router.get("/education", requireAuth, getEducation);

// Edit an education detail by ID
router.put("/education/:recordId", requireAuth, updateEducationRecord);

// Delete an education detail by ID
router.delete(
  "/education/:educationRecordId",
  requireAuth,
  deleteEducationRecord
);

router.post("/jobpref", requireAuth, createJobPreference);

router.get("/jobpref", requireAuth, getJobPreferenceByUser);

router.put("/jobpref/:id", requireAuth, updateJobPreference);

router.delete("/jobpref", requireAuth, deleteJobPreference);

// Projects
router.post("/project", requireAuth, createProject);

router.get("/project", requireAuth, getProjects);

router.put("/project/:projectId", requireAuth, editProject);

router.delete("/project/:projectId", requireAuth, deleteProject);

// Post Skills
router.post("/skills", requireAuth, addSkills);
router.get("/skills", requireAuth, getSkills);
router.put("/skills/:skillId", requireAuth, updateSkills);
router.delete("/skills/:skillId", requireAuth, deleteSkill);

// Language
router.post("/languages", requireAuth, addLanguages);
// Route to get the user's languages
router.get("/languages", requireAuth, getLanguages);

// Route to update the user's languages
router.put("/languages/:languageId", requireAuth, updateLanguages);

// routes/languages.js (or your routes file)
router.delete("/languages/:languageId", requireAuth, deleteLanguage);

// Get combined user profile data
router.get("/profile/:id?", requireAuth, getUserProfileData);
router.get("/profileexistance", requireAuth, checkUserIdExistence);

module.exports = router;
