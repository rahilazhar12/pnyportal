// models/JobPreference.js

const mongoose = require("mongoose");

const JobPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    relocation: {
      type: Boolean,
      default: false,
    },
    relocationPreference: {
      type: String,
      enum: ["Anywhere", "Near", ""],
      default: "",
    },
    preferredLocations: {
      type: [String],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPreference", JobPreferenceSchema);
