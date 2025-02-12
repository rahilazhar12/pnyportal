const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    contact: { type: String },
    city: { type: String },
    role: { type: String, default: "User" },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String },
    otp: { type: String },
    otpexpires: { type: Date },
    applicationsCount: { type: Number, default: 0 }, // Track the number of applied jobs
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobs" }], // Store applied job IDs
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
