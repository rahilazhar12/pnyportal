const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projects: {
    type: [{
      name: { type: String, required: true },
      projectUrl: { type: String, required: true },
      startMonth: { type: String, required: true }, 
      startYear: { type: Number, required: true }, 
      endMonth: { type: String }, 
      endYear: { type: Number }, 
      isOngoing: { type: Boolean, default: false },
      association: { type: String },
      description: { type: String },
      image: { type: String }
    }],
    required: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;