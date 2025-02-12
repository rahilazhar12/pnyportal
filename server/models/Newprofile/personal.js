const mongoose = require("mongoose");
const experience = require("../Newprofile/Experience");

const personalInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  fatherName: { type: String },
  dob: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Transgender"],
    required: true,
  },
  
  maritalstatus: { 
    type: String,
    enum: ["Divorced" , "Engaged" , "Married" , "Separated" , "Single" , "Widow(er)"]
  },
  nationality: { type: String },
  city: { type: String },
  area: { type: String },
  address: { type: String },
  cnic: { type: Number },
  mobile: { type: Number, required: true },
  careerLevel: { type: String },
  expectedSalary: { type: String },
  profilePicture: { type: String }, // Add this field

});

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

module.exports = PersonalInfo;
