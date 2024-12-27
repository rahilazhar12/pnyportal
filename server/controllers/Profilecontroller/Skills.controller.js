const Skills = require("../../models/Newprofile/Skills");

exports.addSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills } = req.body; // Expecting an array of skills

    // Validate input
    if (!userId || !Array.isArray(skills)) {
      return res
        .status(400)
        .json({ message: "User  ID and skills are required." });
    }

    // Check if the user already has a skills entry
    let userSkills = await Skills.findOne({ userId });

    if (userSkills) {
      // If the user already has skills, merge new skills with existing ones
      const existingSkills = userSkills.Skills.map((skill) => skill.skill);
      const newSkills = skills.filter(
        (skill) => !existingSkills.includes(skill.skill)
      );

      if (newSkills.length > 0) {
        // Add new skills to the Skills array for the user
        userSkills.Skills.push(...newSkills);

        // Save the updated skills array
        await userSkills.save();
      }

      return res.status(200).json(userSkills.Skills); // Return the updated list of skills
    } else {
      // If the user does not have any skills, create a new entry with the skills array
      const skillsDocuments = new Skills({
        userId,
        Skills: skills,
      });

      // Save the new skills entry to the database
      const savedSkills = await skillsDocuments.save();
      return res.status(201).json(savedSkills.Skills); // Return the newly created skills
    }
  } catch (error) {
    console.error("Error adding skills:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to get languages for a user
exports.getSkills = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have user authentication in place
  
      // Find the skills document for the user
      const userSkills = await Skills.findOne({ userId });
  
      if (!userSkills) {
        return res.status(404).json({ message: "No skills found for this user." });
      }
  
      return res.status(200).json(userSkills.Skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

exports.updateSkills = async (req, res) => {
  try {
    const { skillId } = req.params; // Skill ID from URL params
    const userId = req.user.id;
    const { skill, experience } = req.body; // Expecting both skill and experience in the body

    // Validate input
    if (!userId || !skillId || !skill || !experience) {
      return res.status(400).json({
        message: "User  ID, skill ID, skill name, and experience are required.",
      });
    }

    // Find the user's existing skills entry
    const userSkills = await Skills.findOne({ userId });

    if (!userSkills) {
      return res.status(404).json({ message: "Skills not found for user." });
    }

    // Find the skill entry by skillId
    const skillIndex = userSkills.Skills.findIndex(
      (s) => s._id.toString() === skillId // We use skillId to match the specific skill
    );

    if (skillIndex === -1) {
      return res.status(404).json({ message: "Skill not found." });
    }

    // Update the skill name and experience (if provided)
    if (skill) {
      userSkills.Skills[skillIndex].skill = skill;
    }
    if (experience) {
      userSkills.Skills[skillIndex].experience = experience;
    }

    // Save the updated skills list
    await userSkills.save();

    return res.status(200).json(userSkills.Skills); // Return the updated list of skills
  } catch (error) {
    console.error("Error updating skills:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params; // The ID of the skill to delete
    const userId = req.user.id; // The authenticated user's ID

    // Validate input
    if (!skillId) {
      return res.status(400).json({ message: "Skill ID is required." });
    }

    // Find the user's skills entry
    const userSkills = await Skills.findOne({ userId });

    if (!userSkills) {
      return res.status(404).json({ message: "Skills not found for user." });
    }

    // Find the index of the skill to delete
    const skillIndex = userSkills.Skills.findIndex(
      (skill) => skill._id.toString() === skillId
    );

    if (skillIndex === -1) {
      return res.status(404).json({ message: "Skill not found." });
    }

    // Remove the skill from the list
    userSkills.Skills.splice(skillIndex, 1);

    // Save the updated skills list
    await userSkills.save();

    return res.status(200).json({ message: "Skill deleted successfully." });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
