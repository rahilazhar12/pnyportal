const Experience = require("../../models/Newprofile/Experience");

// Create experience record
exports.createExperience = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set through authentication middleware
    const { experienceRecords } = req.body; // Expecting experienceRecords to be an array of objects


    if (!Array.isArray(experienceRecords) || experienceRecords.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check each experience record field without preventing duplicates
    for (let record of experienceRecords) {
      const {
        jobTitle,
        company,
        industry,
        teamManagement,
        salary,
        location,
        startMonth,
        startYear,
        currentlyWorking,
        description,
      } = record;
      if (
        !jobTitle ||
        !company ||
        !industry ||
        !teamManagement ||
        !salary ||
        !location ||
        !startMonth ||
        !startYear ||
        currentlyWorking === undefined ||
        !description
      ) {
        return res.status(400).json({
          message: "All fields are required in each experience record.",
        });
      }
    }

    // Find the experience record for the user
    const userExperience = await Experience.findOne({ userId });

    if (!userExperience) {
      const newExperience = new Experience({
        userId,
        experienceRecords: experienceRecords,
      });

      await newExperience.save();
      return res.status(201).json({
        message: "Experience record added successfully",
        data: newExperience.experienceRecords,
      });
    }

    // If experience exists, push new experience records without duplicate check
    userExperience.experienceRecords.push(...experienceRecords);

    await userExperience.save();
    res.status(200).json({
      message: "Experience record added successfully",
      data: userExperience.experienceRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding experience record",
      error: error.message,
    });
  }
};

// Get all experience details
exports.getExperience = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set through authentication middleware
    const userExperience = await Experience.findOne({ userId });

    if (!userExperience) {
      return res
        .status(404)
        .json({ message: "No experience records found for this user." });
    }

    res.status(200).json({
      message: "Experience records fetched successfully",
      data: userExperience.experienceRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching experience records",
      error: error.message,
    });
  }
};

// Update experience record
exports.updateExperienceRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const recordId = req.params.recordId;

    const userExperience = await Experience.findOne({ userId });

    if (!userExperience) {
      return res
        .status(404)
        .json({ message: "User's experience records not found" });
    }

    const recordIndex = userExperience.experienceRecords.findIndex(
      (record) => record._id.toString() === recordId
    );

    if (recordIndex === -1) {
      return res.status(404).json({ message: "Experience record not found" });
    }

    userExperience.experienceRecords[recordIndex] = {
      ...userExperience.experienceRecords[recordIndex],
      ...req.body,
    };

    await userExperience.save();

    res.status(200).json({
      message: "Experience record updated successfully",
      data: userExperience.experienceRecords[recordIndex],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating experience record",
      error: error.message,
    });
  }
};

// Delete experience record
exports.deleteExperienceRecord = async (req, res) => {
  const userId = req.user.id;
  const experienceRecordId = req.params.experienceRecordId;

  try {
    const userExperience = await Experience.findOne({ userId });

    if (!userExperience) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const recordIndex = userExperience.experienceRecords.findIndex(
      (record) => record._id.toString() === experienceRecordId
    );

    if (recordIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Experience record not found" });
    }

    userExperience.experienceRecords.splice(recordIndex, 1);

    await userExperience.save();

    res.json({
      success: true,
      message: "Experience record deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting experience record",
    });
  }
};
