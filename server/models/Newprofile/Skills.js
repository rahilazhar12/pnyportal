const mongoose = require("mongoose");

const SkillsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Assuming you have a User model
    },
    Skills: [
      {
        skill: {
          type: String,
          required: true,
        },
        experience: {
          type: String,
          enum: ["Beginner", "Intermediate", "Expert"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Skills = mongoose.model("skills", SkillsSchema);

module.exports = Skills;
