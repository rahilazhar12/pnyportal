const mongoose = require('mongoose');

const jobsModel = new mongoose.Schema(
  {
    companyName: { type: String },
    jobTitle: { type: String },
    companyLogo: { type: String },
    minPrice: { type: String },
    maxPrice: { type: String },
    salaryType: { type: String },
    jobLocation: { type: String },
    postingDate: { type: String },
    experienceLevel: { type: String },
    skillsRequired: { type: [String] },
    employmentType: { type: String },
    description: { type: String },
    jobPostedBy: { type: String },
    category: { type: String }, // Field to store the job category
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Companies' // Optionally, add a reference to the 'Companies' model
    }
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model("jobs", jobsModel);
