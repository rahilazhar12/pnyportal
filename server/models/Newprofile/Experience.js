const mongoose = require("mongoose");

// Experience Schema
const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    experienceRecords: [
      {
        jobTitle: { type: String, required: true },
        company: { type: String, required: true },
        industry: { type: String, required: true },
        teamManagement: { type: String, required: true },
        salary: { type: String, required: true },
        location: { type: String, required: true },
        startMonth: { type: String, required: true },
        startYear: { type: String, required: true },
        endMonth: { type: String, required: false },
        endYear: { type: String, required: false },
        currentlyWorking: { type: Boolean, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
