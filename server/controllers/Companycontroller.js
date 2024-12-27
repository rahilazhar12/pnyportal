const Company = require("../models/Companymodel"); // Assuming your model file is named CompanyModel.js
const { Hashedpassword, comparePassword } = require("../helpers/useAuth");
const generateTokenAndSetCookie = require("../helpers/generatetoken");
const { sendVerificationCodeEmail } = require("../utils/emailService");

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}
// Post a new company
const CreateCompany = async (req, res) => {
  const {
    name,
    ntnnumber,
    email,
    password,
    personincontact,
    about,
    city,
    website,
    facebook,
    linkedin,
    cnic,
    role,
  } = req.body;

  if (
    !name ||
    !ntnnumber ||
    !email ||
    !personincontact ||
    !city ||
    !website ||
    !facebook ||
    !linkedin ||
    !cnic
  ) {
    return res.status(400).json({ message: "Fill all the fields" });
  }

  const checkemail = await Company.findOne({ email });
  if (checkemail) {
    return res.status(400).send({ message: "Email is Already Registered" });
  }

  const hash = await Hashedpassword(password);
  const verificationCode = generateVerificationCode(); // generate a 6-digit code

  try {
    const newCompany = new Company({
      name,
      ntnnumber,
      email,
      personincontact,
      about,
      city,
      website,
      facebook,
      linkedin,
      cnic,
      role,
      password: hash,
      verificationCode, // Store the generated code in the company record
    });

    await newCompany.save();
    await sendVerificationCodeEmail(email, verificationCode, name);

    // Respond with a message indicating the email was sent
    return res
      .status(200)
      .json({
        message:
          "Verification code sent. Please check your email to complete registration.",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const VerifyCompany = async (req, res) => {
  const { email, code } = req.body;

  const company = await Company.findOne({ email });

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.verificationCode === code) {
    company.verificationCode = null; // Clear the code once verified
    company.isApproved = false; // Mark as approved or move to next approval step
    company.isVerified = true;
    await company.save();
    return res
      .status(200)
      .json({
        message:
          "Verification successful. Your account is now pending admin approval.",
      });
  } else {
    return res.status(400).json({ message: "Invalid verification code" });
  }
};

const LoginCompany = async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    // Find the company by email
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the user is verified
    if (!company.isVerified) {
      // Resend verification code
      const verificationCode = generateVerificationCode();
      company.verificationCode = verificationCode;
      await company.save(); // Save the new code to the database

      // Send verification email
      await sendVerificationCodeEmail(email, verificationCode, company.name);

      return res.status(403).json({
        message:
          "Account not verified. A new verification code has been sent to your email.",
      });
    }

    // Check if the company is approved
    if (!company.isApproved) {
      return res.status(403).json({ message: "Company not approved" });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await comparePassword(password, company.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT with company ID as payload
    generateTokenAndSetCookie(company._id, company.name, res); // Capture the token
    // Send the token and company ID as response
    res.status(200).json({
      message: "Login successful",
      role: company.role,
      name: company.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Logoutcompany = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const approvecompanyrequest = async (req, res) => {
//     const { status } = req.body; // Assuming 'status' can be 'approved' or 'rejected'

//     try {
//         const company = await Company.findById(req.params.id);

//         if (!company) {
//             return res.status(404).json({ message: "Company not found." });
//         }

//         if (status === "approved") {
//             company.isApproved = true;
//             await company.save();
//             res.status(200).json({ message: "Company approved successfully." });
//         } else if (status === "rejected") {
//             // Delete the company record if the admin rejects the request
//             await Company.findByIdAndDelete(req.params.id);
//             res.status(200).json({ message: "Company rejected and deleted successfully." });
//         } else {
//             res.status(400).json({ message: "Invalid status. Please specify 'approved' or 'rejected'." });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

const approvecompanyrequest = async (req, res) => {
  const { status } = req.body; // Assuming 'status' is a boolean or 'rejected'

  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (status === "true") {
      company.isApproved = true;
      await company.save();
      res.status(200).json({ message: "Company approved successfully." });
    } else if (status === "false") {
      company.isApproved = false;
      await company.save();
      res.status(200).json({ message: "Company approval set to false." });
    } else if (status === "rejected") {
      // Delete the company record if the admin rejects the request
      await Company.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: "Company rejected and deleted successfully." });
    } else {
      res
        .status(400)
        .json({
          message:
            "Invalid status. Please specify 'true', 'false', or 'rejected'.",
        });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Getallcompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving companies", error: error.message });
  }
};

module.exports = {
  CreateCompany,
  VerifyCompany,
  approvecompanyrequest,
  LoginCompany,
  Logoutcompany,
  Getallcompanies,
};
