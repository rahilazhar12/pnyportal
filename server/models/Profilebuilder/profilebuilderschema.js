const mongoose = require('mongoose');
const jobSchema = require('../Profilebuilder/Jobsschema')
const Academics = require('../Profilebuilder/Academics')
const Skills = require('../Profilebuilder/Skills');
const Trainings = require('./Trainings');
const Certification = require('./Certification');
const Achievements = require('./Achievements');
const Research = require('./Research');



const Profilebuildermodal = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you are using MongoDB's ObjectIds for user IDs
    required: false,
    ref: 'users' // Assuming your user model is named 'User'
  },

  userName: {
    type: String,
    required: false
  },

  fname: {
    type: String,
    required: false
  },
  lname: {
    type: String,
    required: false
  },
  dob: {
    type: String,
    required: false
  },
  age: {
    type: Number, // Changed from String to Number to better represent age
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  martialstatus: {
    type: String,
    required: false
  },
  fathername: {
    type: String,
    required: false
  },
  religion: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: false
  },
  landline: {
    type: String,
    required: false
  },
  postaladdress: {
    type: String,
    required: false
  },
  domicile: {
    type: String,
    required: false
  },
  ResCountry: {
    type: String,
    required: false
  },
  ResCity: {
    type: String,
    required: false
  },
  nationality: {
    type: String,
    required: false
  },
  CNIC: {
    type: String,
    required: false
  },
  CNICexpiry: {
    type: String,
    required: false
  },
  hafizquran: {
    type: String,
    required: false
  },
  ExServiceOfficial: {
    type: String,
    required: false
  },
  Governmentofficial: {
    type: String,
    required: false
  },
  Disabled: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  },




  JobTitle: {
    type: String,
    required: false
  },
  CareerLevel: {
    type: String,
    required: false
  },
  TargetMonthlySalary: {
    type: String,
    required: false
  },
  LastMonthlySalary: {
    type: String,
    required: false
  },



  jobs: [jobSchema], // Array of job records

  academics: [Academics],

  skills: [Skills],

  trainings: [Trainings],

  certification: [Certification],

  achievements: [Achievements],

  research: [Research],


});

module.exports = mongoose.model("Profilebuilder", Profilebuildermodal);
