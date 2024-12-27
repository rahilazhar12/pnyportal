const mongoose = require("mongoose");

const PNYAlumniSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    contact: { type: String },
    city: { type: String },
    role: { type: String, default: "pnyalumini" },
    batchNo: { type: String },
    courseName: { type: String },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String }, // Add this field
    otp: { type: String },
    otpexpires: { type: Date },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pnyalumini", PNYAlumniSchema);
