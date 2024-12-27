const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model
  },
  languages: [
    {
    country: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true,
    },
  }],
}, { timestamps: true });

const Language = mongoose.model('Language', LanguageSchema);

module.exports = Language;
