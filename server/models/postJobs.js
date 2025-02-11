const mongoose = require('mongoose');

const jobsModel = new mongoose.Schema(
  {
    companyName: { type: String },
    jobTitle: { type: String },
    companyLogo: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    salaryType: { type: String },
    jobLocation: { type: String },
    postingDate: { type: Date },
    expirationDate: { type: Date }, // Add expiration date field
    experienceLevel: { type: String },
    skillsRequired: { type: [String] },
    jobDescription: { type: String },
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
