const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    ntnnumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    personincontact: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "company",
    },
    verificationCode: { type: String }, // Store verification code temporarily
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    password: { type: String, default: "" },
    otp: { type: String },
    otpexpires: { type: Date },
  },
  { timestamps: true } // This will add `createdAt` and `updatedAt` fields automatically
);

module.exports = mongoose.model("Companies", CompanySchema);
