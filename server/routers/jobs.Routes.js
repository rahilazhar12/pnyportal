// import mongoose from "mongoose";
const express = require("express");
const {
  getJobsList,
  getApplicationsForJob,
  Deletejobsandapplication,
  updateJob,
  searchJobs,
  getSuggestions,
  getApplicationsByApplicant,
  updateApplicationStatus,
} = require("../controllers/jobsController.js");
const {
  createNewJob,
  Getjobsbycategories,
  GetjobsbycompanyId,
} = require("../controllers/createJobByComp.js");
const upload = require("../multer/imgConfig.js");
const { requireAuth } = require("../middlewares/requiredauth.js");

const router = express.Router();

router.post(
  "/create-new-jobs",
  upload.single("companyLogo"),
  requireAuth,
  createNewJob
);
router.get("/jobs-by-category/:category", Getjobsbycategories);
router.get("/get-jobs-companyId", requireAuth, GetjobsbycompanyId);
router.get("/getjobs/:id?", getJobsList);
router.get("/jobs/:jobId", getApplicationsForJob);
router.delete("/delete-jobs/:id", Deletejobsandapplication);
router.put("/update-job/:id", updateJob);
router.get("/search", searchJobs);
router.get("/suggestions", getSuggestions);
router.get("/applications", requireAuth, getApplicationsByApplicant);
router.put("/update-status/:applicant", updateApplicationStatus);

module.exports = router;
