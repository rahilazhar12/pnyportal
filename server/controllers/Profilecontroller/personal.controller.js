const PersonalInfo = require("../../models/Newprofile/personal");
const User = require("../../models/user.model");
const PNYAlumniSchema = require("../../models/pnyalumini");
const fs = require("fs");
const path = require("path");

exports.savePersonalInfo = async (req, res) => {
  const userId = req.user.id; // Assuming req.user.id is available from authentication
  const {
    name,
    email,
    fatherName,
    dob,
    gender,
    cnic,
    maritalstatus,
    nationality,
    city,
    area,
    address,
    mobile,
    careerLevel,
    expectedSalary,
  } = req.body;

  // Retrieve uploaded file path
  const profilePicture = req.file ? req.file.path : null;

  // Check for required fields
  if (!name || !email || !dob || !gender || !mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields are missing" });
  }

  try {
    // Check if the user exists in either the User or PNYAlumniSchema model
    const user = await User.findById({ _id: userId }); // Check in User model
    const alumni = await PNYAlumniSchema.findOne({ _id: userId }); // Check in PNYAlumniSchema model

    // If user is not found in either model, return an error
    if (!user && !alumni) {
      return res.status(404).json({
        success: false,
        message: "User not found in either User or PNYAlumniSchema",
      });
    }

    const Email = await PersonalInfo.findOne({ email });
    if (Email) {
      return res.status(400).send({ message: "Email Already exist" });
    }

    const mobilenumber = await PersonalInfo.findOne({ mobile });
    if (mobilenumber) {
      return res.status(400).send({ message: "Mobile number Already exist" });
    }

    const CNIC = await PersonalInfo.findOne({ cnic });
    if (CNIC) {
      return res.status(400).send({ message: "CNIC Already exist" });
    }

    // Check if personal info already exists for this user
    const existingPersonalInfo = await PersonalInfo.findOne({ userId });
    if (existingPersonalInfo) {
      return res.status(400).json({
        success: false,
        message: "Personal information already exists for this user",
      });
    }

    // Save new personal info
    const personalInfo = new PersonalInfo({
      userId,
      name,
      email,
      fatherName,
      dob,
      gender,
      cnic,
      maritalstatus,
      nationality,
      city,
      area,
      address,
      mobile,
      careerLevel,
      expectedSalary,
      profilePicture, // Save the uploaded file path
    });

    await personalInfo.save();
    res.status(201).json({
      success: true,
      message: "Personal information saved successfully",
      personalInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save personal information",
      error: error.message,
    });
  }
};

// GET: Fetch personal information
exports.getPersonalInfoByUserId = async (req, res) => {
  const userId = req.user.id;

  try {
    const personalInfo = await PersonalInfo.findOne({ userId });
    if (!personalInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Personal information not found" });
    }

    res.status(200).json({ success: true, personalInfo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch personal information",
      error: error.message,
    });
  }
};

// PUT: Update personal information
exports.updatePersonalInfo = async (req, res) => {
  const {
    personalInfoId,
    name,
    email,
    fatherName,
    dob,
    gender,
    cnic,
    maritalstatus,
    nationality,
    city,
    area,
    mobile,
    careerLevel,
    expectedSalary,
  } = req.body;

  // Retrieve uploaded file path
  const profilePicture = req.file ? req.file.path.replace(/\\/g, "/") : null; // Normalize path

  if (!personalInfoId) {
    return res.status(400).json({
      success: false,
      message: "Personal information ID is required",
    });
  }

  try {
    // Fetch personal information by ID
    const personalInfo = await PersonalInfo.findById(personalInfoId);
    if (!personalInfo) {
      return res.status(404).json({
        success: false,
        message: "Personal information not found",
      });
    }

    // Handle profile picture update
    if (profilePicture) {
      if (personalInfo.profilePicture) {
        // Delete old profile picture if it exists
        const oldProfilePicturePath = path.join(
          __dirname,
          "..",
          "..",
          personalInfo.profilePicture
        );

        fs.access(oldProfilePicturePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldProfilePicturePath, (err) => {
              if (err) {
                console.error(
                  `Failed to delete old profile picture: ${err.message}`
                );
              } else {
              }
            });
          } else {
            console.warn(
              `Old profile picture not found: ${oldProfilePicturePath}`
            );
          }
        });
      }

      // Update profile picture path
      personalInfo.profilePicture = profilePicture;
    }

    // Update other fields if provided
    personalInfo.name = name || personalInfo.name;
    personalInfo.email = email || personalInfo.email;
    personalInfo.fatherName = fatherName || personalInfo.fatherName;
    personalInfo.dob = dob || personalInfo.dob;
    personalInfo.gender = gender || personalInfo.gender;
    personalInfo.cnic = cnic || personalInfo.cnic;
    personalInfo.mobile = mobile || personalInfo.mobile;
    personalInfo.careerLevel = careerLevel || personalInfo.careerLevel;
    personalInfo.expectedSalary = expectedSalary || personalInfo.expectedSalary;
    personalInfo.maritalstatus = maritalstatus || personalInfo.maritalstatus;
    personalInfo.nationality = nationality || personalInfo.nationality;
    personalInfo.city = city || personalInfo.city;
    personalInfo.area = area || personalInfo.area;

    // Save updated personal info
    try {
      await personalInfo.save();
      return res.status(200).json({
        success: true,
        message: "Personal information updated successfully",
        personalInfo,
      });
    } catch (saveError) {
      console.error("Error saving personal info:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save updated personal information",
        error: saveError.message,
      });
    }
  } catch (error) {
    console.error("Error during update:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update personal information",
      error: error.message,
    });
  }
};
