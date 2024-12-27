const Userschema = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const profilebuilderschema = require("../models/Profilebuilder/profilebuilderschema.js");
const PNYAlumniSchema = require("../models/pnyalumini.js");
const generateTokenAndSetCookie = require("../helpers/generatetoken");
const { sendVerificationCodeEmail } = require("../utils/emailService.js");
const path = require("path"); // To handle file path
const fs = require("fs"); // To remove old profile picture if updated

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}
const UserRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact,
      city,
      role,
      isPNYAlumni,
      batchNo,
      courseName,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Please fill all the fields." });
    }

    const checkUser = await Userschema.findOne({ email });
    const checkAlumni = await PNYAlumniSchema.findOne({ email });

    if (checkUser || checkAlumni) {
      return res
        .status(400)
        .send({ message: "Email already exists in our records." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    if (isPNYAlumni) {
      if (!batchNo || !courseName) {
        return res.status(400).send({
          message:
            "Please provide batch number and course name for PNY alumni.",
        });
      }

      const newAlumni = new PNYAlumniSchema({
        name,
        email,
        password: hashedPassword,
        contact,
        city,
        role,
        batchNo,
        courseName,
        verificationCode,
      });

      await newAlumni.save();
      await sendVerificationCodeEmail(email, verificationCode, name);

      return res.status(201).send({
        message:
          "Verification code sent. Please check your email to complete registration.",
      });
    } else {
      const newUser = new Userschema({
        name,
        email,
        password: hashedPassword,
        contact,
        city,
        role,
        verificationCode,
      });

      await newUser.save();
      await sendVerificationCodeEmail(email, verificationCode, name);

      return res.status(201).send({
        message:
          "Verification code sent. Please check your email to complete registration.",
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).send({ message: "Failed to register user." });
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Attempt to find the user in both schemas
    const user = await Userschema.findOne({ email });
    const pnyAlumni = await PNYAlumniSchema.findOne({ email });

    // Determine which user object to use
    const currentUser = user || pnyAlumni;

    // Check if a user was found
    if (!currentUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the user is verified
    if (!currentUser.isVerified) {
      // Resend verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString(); // 6-digit code
      currentUser.verificationCode = verificationCode;
      await currentUser.save(); // Save the new code to the database

      // Send verification email
      await sendVerificationCodeEmail(
        email,
        verificationCode,
        currentUser.name
      );

      return res.status(403).json({
        message:
          "Account not verified. A new verification code has been sent to your email.",
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      currentUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(currentUser._id, currentUser.name, res);

    // Determine role based on the type of user
    const role = user ? "User" : "pnyalumini";

    // Respond with login success
    res.status(200).json({
      message: "Login Success",
      role: role,
      name: currentUser.name,
      profilePicture: currentUser.profilePicture,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Logoutuser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const EditUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       name,
//       email,
//       contact,
//       city,
//       role,
//       isPNYAlumni,
//       batchNo,
//       courseName,
//     } = req.body;

//     // Check if the user exists
//     const user = await Userschema.findById(userId);

//     if (!user) {
//       return res.status(404).send({ message: "User not found." });
//     }

//     // Optionally, check if email is being changed and if it already exists
//     if (email && email !== user.email) {
//       const checkUser = await Userschema.findOne({ email });
//       const checkAlumni = await PNYAlumniSchema.findOne({ email });

//       if (checkUser || checkAlumni) {
//         return res.status(400).send({ message: "Email already exists." });
//       }
//     }

//     // If a profile picture is provided, handle the file upload
//     if (req.file) {
//       const profilePicture = req.file.path; // Assuming file is stored in `uploads/` folder

//       // Optionally, delete old profile picture if it's being updated
//       if (user.profilePicture && fs.existsSync(user.profilePicture)) {
//         fs.unlinkSync(user.profilePicture);
//       }

//       user.profilePicture = profilePicture; // Save the new profile picture path
//     }

//     // If the user is an alumni and the flag is set to true, update alumni fields
//     if (isPNYAlumni && !user.isPNYAlumni) {
//       if (!batchNo || !courseName) {
//         return res
//           .status(400)
//           .send({ message: "Please provide batch number and course name." });
//       }

//       const newAlumni = new PNYAlumniSchema({
//         name,
//         email,
//         contact,
//         city,
//         role,
//         batchNo,
//         courseName,
//       });

//       await newAlumni.save();
//     }

//     // Update user details
//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.contact = contact || user.contact;
//     user.city = city || user.city;
//     user.role = role || user.role;
//     user.isPNYAlumni = isPNYAlumni || user.isPNYAlumni;
//     user.batchNo = batchNo || user.batchNo;
//     user.courseName = courseName || user.courseName;

//     // Save the updated user
//     await user.save();

//     return res
//       .status(200)
//       .send({ message: "User details updated successfully." });
//   } catch (error) {
//     console.error("Edit User Error:", error);
//     return res.status(500).send({ message: "Failed to update user." });
//   }
// };

const EditUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      contact,
      city,
      role,
      isPNYAlumni,
      batchNo,
      courseName,
      password, // Add password to the destructured fields
    } = req.body;

    // Check if the user exists in either Userschema or PNYAlumniSchema
    const userInUserschema = await Userschema.findById(userId);
    const userInPNYAlumniSchema = await PNYAlumniSchema.findById(userId);

    if (!userInUserschema && !userInPNYAlumniSchema) {
      return res.status(404).send({
        message: "User not found in either Userschema or PNYAlumniSchema.",
      });
    }

    // Proceed only if user is found in at least one schema
    let profilePicture;
    // Handle file upload if profile picture is provided
    if (req.file) {
      profilePicture = req.file.path; // Assuming the file is stored in `uploads/` folder

      // Optionally delete old profile picture for Userschema
      if (
        userInUserschema?.profilePicture &&
        fs.existsSync(userInUserschema.profilePicture)
      ) {
        fs.unlinkSync(userInUserschema.profilePicture);
      }

      // Optionally delete old profile picture for PNYAlumniSchema
      if (
        userInPNYAlumniSchema?.profilePicture &&
        fs.existsSync(userInPNYAlumniSchema.profilePicture)
      ) {
        fs.unlinkSync(userInPNYAlumniSchema.profilePicture);
      }
    }

    // Hash the password if it's being updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10
    }

    // Update details in Userschema if the user exists there
    if (userInUserschema) {
      userInUserschema.name = name || userInUserschema.name;
      userInUserschema.email = email || userInUserschema.email;
      userInUserschema.contact = contact || userInUserschema.contact;
      userInUserschema.city = city || userInUserschema.city;
      userInUserschema.role = role || userInUserschema.role;
      userInUserschema.isPNYAlumni =
        isPNYAlumni || userInUserschema.isPNYAlumni;
      userInUserschema.batchNo = batchNo || userInUserschema.batchNo;
      userInUserschema.courseName = courseName || userInUserschema.courseName;

      if (profilePicture) {
        userInUserschema.profilePicture = profilePicture;
      }

      if (hashedPassword) {
        userInUserschema.password = hashedPassword;
      }

      await userInUserschema.save();
    }

    // Update details in PNYAlumniSchema if the user exists there
    if (userInPNYAlumniSchema) {
      userInPNYAlumniSchema.name = name || userInPNYAlumniSchema.name;
      userInPNYAlumniSchema.email = email || userInPNYAlumniSchema.email;
      userInPNYAlumniSchema.contact = contact || userInPNYAlumniSchema.contact;
      userInPNYAlumniSchema.city = city || userInPNYAlumniSchema.city;
      userInPNYAlumniSchema.role = role || userInPNYAlumniSchema.role;
      userInPNYAlumniSchema.batchNo = batchNo || userInPNYAlumniSchema.batchNo;
      userInPNYAlumniSchema.courseName =
        courseName || userInPNYAlumniSchema.courseName;

      if (profilePicture) {
        userInPNYAlumniSchema.profilePicture = profilePicture;
      }

      if (hashedPassword) {
        userInPNYAlumniSchema.password = hashedPassword;
      }

      await userInPNYAlumniSchema.save();
    }

    return res.status(200).send({
      message: "User details updated successfully in the relevant schema(s).",
    });
  } catch (error) {
    console.error("Edit User Error:", error);
    return res.status(500).send({ message: "Failed to update user." });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user =
      (await Userschema.findOne({ email, verificationCode: code })) ||
      (await PNYAlumniSchema.findOne({ email, verificationCode: code }));

    if (!user) {
      return res.status(400).send({ message: "Invalid verification code." });
    }

    user.isVerified = true;
    user.verificationCode = null; // Clear the code after verification
    await user.save();

    return res.status(200).send({
      message: "Verification successful. User registered successfully.",
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).send({ message: "Failed to verify code." });
  }
};

const Profileregister = async (req, res) => {
  try {
    // Extract user details from request body or authentication token
    const { userName, id } = req.user; // Extracted from JWT token or another authentication mechanism

    // Check if a profile with the same userId already exists
    const existingUser = await profilebuilderschema.findOne({ userId: id });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "Profile with this ID already exists." });
    }

    // Destructure and possibly parse other fields from req.body
    let {
      jobs,
      academics,
      skills,
      trainings,
      certification,
      achievements,
      research,
    } = req.body;

    // Convert any stringified JSON fields back to objects
    const jsonFields = {
      jobs,
      academics,
      skills,
      trainings,
      certification,
      achievements,
      research,
    };
    for (let key in jsonFields) {
      if (typeof jsonFields[key] === "string") {
        jsonFields[key] = JSON.parse(jsonFields[key]);
      }
    }

    // Initialize newUser with parsed and other fields
    const newUser = new profilebuilderschema({
      userId: id,
      userName,
      ...req.body,
      ...jsonFields,
    });

    if (req.file) {
      newUser.profilePicture = req.file.path;
    }

    const result = await newUser.save();
    return res
      .status(201)
      .send({ message: "Profile registered successfully", profile: result });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 11000) {
      return res.status(409).send({
        message:
          "Duplicate key error: Profile already exists with similar unique fields.",
      });
    } else {
      return res
        .status(500)
        .send({ message: "Failed to register profile.", error: error.message });
    }
  }
};

const Getprofile = async (req, res) => {
  const userId = req.params.id; // Assuming the userId is passed in the same way as before
  try {
    // Use `findOne` since `userId` is expected to be unique for each profile
    // Replace `profilebuilderschema` with the actual name of your mongoose model if it's different
    const result = await profilebuilderschema.findOne({ userId: userId });

    if (result) {
      res.status(200).send(result);
    } else {
      // If no profile is found with the given userId
      res.status(404).send({ Message: "Profile not found" });
    }
  } catch (error) {
    console.log(error);
    // Respond with a server error status code when an error occurs
    res
      .status(500)
      .send({ Message: "An error occurred while fetching the profile" });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the profile to ensure it exists and to update it
    const profile = await profilebuilderschema.findById(id);
    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    // Update fields directly from req.body
    const fieldsToUpdate = {
      userName: req.body.userName,
      fname: req.body.fname,
      lname: req.body.lname,
      dob: req.body.dob,
      age: req.body.age,
      gender: req.body.gender,
      martialstatus: req.body.martialstatus,
      fathername: req.body.fathername,
      religion: req.body.religion,
      mobile: req.body.mobile,
      landline: req.body.landline,
      postaladdress: req.body.postaladdress,
      domicile: req.body.domicile,
      ResCountry: req.body.ResCountry,
      ResCity: req.body.ResCity,
      nationality: req.body.nationality,
      CNIC: req.body.CNIC,
      CNICexpiry: req.body.CNICexpiry,
      hafizquran: req.body.hafizquran,
      ExServiceOfficial: req.body.ExServiceOfficial,
      Governmentofficial: req.body.Governmentofficial,
      Disabled: req.body.Disabled,
      JobTitle: req.body.JobTitle,
      CareerLevel: req.body.CareerLevel,
      TargetMonthlySalary: req.body.TargetMonthlySalary,
      LastMonthlySalary: req.body.LastMonthlySalary,
      jobs: req.body.jobs,
      academics: req.body.academics,
      research: req.body.research,
      skills: req.body.skills,
      trainings: req.body.trainings,
      certification: req.body.certification,
      achievements: req.body.achievements,
    };

    // Iterate through all keys in fieldsToUpdate to update only those provided in req.body
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (req.body[key] !== undefined) {
        // Check if specific key is provided in the request
        profile[key] = fieldsToUpdate[key];
      }
    });

    // Save the updated profile
    const updatedProfile = await profile.save();

    res.status(200).send({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res
      .status(500)
      .send({ message: "Failed to update profile", error: error.message });
  }
};

const Getallusers = async (req, res) => {
  try {
    const users = await Userschema.find();
    return res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

const GetUserById = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check in Userschema
    let user = await Userschema.findById(id);

    // If not found in Userschema, check in PNYAlumniSchema
    if (!user) {
      user = await PNYAlumniSchema.findById(id);
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in both schemas" });
    }

    return res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

const Getallpnyalumini = async (req, res) => {
  try {
    const alumniList = await PNYAlumniSchema.find();
    return res.status(200).json(alumniList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving alumni list", error: error.message });
  }
};

module.exports = {
  UserRegistration,
  UserLogin,
  Logoutuser,
  Profileregister,
  Getprofile,
  updateProfile,
  verifyCode,
  Getallusers,
  GetUserById,
  EditUser,
  Getallpnyalumini,
};
