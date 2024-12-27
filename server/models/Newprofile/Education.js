const mongoose = require("mongoose");

// Education Schema
const educationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    educationRecords: [
      {
        degreeTitle: { type: String, required: true },
        fieldOfStudy: [{ type: String, required: true }], // Changed to array
        location: { type: String, required: true },
        institution: { type: String, required: true },
        completionYear: { type: Number, required: true },
        cgpa: { type: Number, required: false },
        cgpaOutOf: { type: Number, required: false }, // Added this field
      },
    ],
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);
module.exports = Education;
