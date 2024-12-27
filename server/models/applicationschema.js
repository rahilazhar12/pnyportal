const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'jobs',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: { // Applicant's name
      type: String,
      required: true,
    },
    contact: { // Applicant's contact
      type: String,
      required: true,
    },
    email: { // Applicant's email
      type: String,
      required: true,
    },
    city: { // Applicant's city
      type: String,
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    // Additional fields can be added here, such as a cover letter
  },
  { timestamps: true } // This will add `createdAt` and `updatedAt` fields automatically
);

module.exports = mongoose.model('Application', applicationSchema);
