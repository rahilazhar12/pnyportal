const Education = require("../../models/Newprofile/Education");

exports.createEducation = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set through authentication middleware
    const { educationRecords } = req.body; // Expecting educationRecords to be an array of objects

    // Check if educationRecords is provided and if it's an array
    if (!Array.isArray(educationRecords) || educationRecords.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Iterate through education records and check if each field is provided
    for (let record of educationRecords) {
      const {
        degreeTitle,
        fieldOfStudy,
        location,
        institution,
        completionYear,
       
      } = record;
      if (
        !degreeTitle ||
        !Array.isArray(fieldOfStudy) || fieldOfStudy.length === 0 ||
        !location ||
        !institution ||
        !completionYear 
      ) {
        return res.status(400).json({
          message: "All fields are required in each education record.",
        });
      }
    }

    // Find the education record for the user by userId
    const userEducation = await Education.findOne({ userId });

    if (!userEducation) {
      // If no education record is found, create a new one for the user
      const newEducation = new Education({
        userId,
        educationRecords: educationRecords,
      });

      // Save the new education record for the user
      await newEducation.save();
      return res.status(201).json({
        message: "Education record added successfully",
        data: newEducation.educationRecords,
      });
    }

    // If education record exists for the user, push the new education record into the existing array
    userEducation.educationRecords.push(...educationRecords);

    // Save the updated education records array
    await userEducation.save();

    // Respond with success message and the updated education records
    res.status(200).json({
      message: "Education record added successfully",
      data: userEducation.educationRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding education record",
      error: error.message,
    });
  }
};

// Get all education details
exports.getEducation = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set through authentication middleware

    // Find the education record for the user by userId
    const userEducation = await Education.findOne({ userId });

    if (!userEducation) {
      return res
        .status(404)
        .json({ message: "No education records found for this user." });
    }

    // Return the education records for the user
    res.status(200).json({
      message: "Education records fetched successfully",
      data: userEducation.educationRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching education records",
      error: error.message,
    });
  }
};

// In your controller file (e.g., educationController.js)
// exports.updateEducationRecord = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the user ID from authentication middleware
//     const recordId = req.params.recordId; // The ID of the specific education record to update

//     // Find the user's education document
//     const userEducation = await Education.findOne({ userId });

//     if (!userEducation) {
//       return res
//         .status(404)
//         .json({ message: "User's education records not found" });
//     }

//     // Find the index of the record to be updated
//     const recordIndex = userEducation.educationRecords.findIndex(
//       (record) => record._id.toString() === recordId
//     );

//     if (recordIndex === -1) {
//       return res.status(404).json({ message: "Education record not found" });
//     }

//     // Update the specific record in the array
//     userEducation.educationRecords[recordIndex] = {
//       ...userEducation.educationRecords[recordIndex],
//       ...req.body, // Use the data from the request body to update the record
//     };

//     // Save the updated document
//     await userEducation.save();

//     res.status(200).json({
//       message: "Education record updated successfully",
//       data: userEducation.educationRecords[recordIndex],
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating education record",
//       error: error.message,
//     });
//   }
// };

exports.updateEducationRecord = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from authentication middleware
    const recordId = req.params.recordId; // The ID of the specific education record to update

    // Find the user's education document
    const userEducation = await Education.findOne({ userId });

    if (!userEducation) {
      return res
        .status(404)
        .json({ message: "User's education records not found" });
    }

    // Find the index of the record to be updated
    const recordIndex = userEducation.educationRecords.findIndex(
      (record) => record._id.toString() === recordId
    );

    if (recordIndex === -1) {
      return res.status(404).json({ message: "Education record not found" });
    }

    // Validate fieldOfStudy if provided
    if (req.body.fieldOfStudy && !Array.isArray(req.body.fieldOfStudy)) {
      return res
        .status(400)
        .json({ message: "Field of Study must be an array" });
    }

    // Merge the existing record with the new data
    userEducation.educationRecords[recordIndex] = {
      ...userEducation.educationRecords[recordIndex].toObject(), // Ensure plain object for merging
      ...req.body, // Overwrite only the fields provided in the request body
    };

    // Save the updated document
    await userEducation.save();

    res.status(200).json({
      message: "Education record updated successfully",
      data: userEducation.educationRecords[recordIndex],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating education record",
      error: error.message,
    });
  }
};



// Delete education detail by ID
exports.deleteEducationRecord = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the session or JWT
  const educationRecordId = req.params.educationRecordId; // Get the education record ID from the URL parameter

  try {
    // Find the user's education document
    const userEducation = await Education.findOne({ userId: userId });

    if (!userEducation) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the education record to delete
    const recordIndex = userEducation.educationRecords.findIndex(
      (record) => record._id.toString() === educationRecordId
    );

    if (recordIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Education record not found" });
    }

    // Remove the education record from the array
    userEducation.educationRecords.splice(recordIndex, 1);

    // Save the updated user document
    await userEducation.save();

    // Return a success message
    res.json({
      success: true,
      message: "Education record deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting education record",
    });
  }
};
