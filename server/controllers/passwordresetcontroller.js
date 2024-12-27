const User = require("../models/user.model");
const pnyalumini = require("../models/pnyalumini");
const bcrypt = require("bcrypt");
const { sendemail } = require("../utils/otp");

const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.Passwordresetrequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email belongs to a user in either 'User' or 'pnyalumini' collection.
    let existingUser = await User.findOne({ email });

    // If not found in 'User', check 'pnyalumini'.
    if (!existingUser) {
      existingUser = await pnyalumini.findOne({ email });
      if (!existingUser) {
        return res.send({ Message: "User not found" });
      }
    }

    // Generate and set OTP
    const otp = generateotp();
    const otpexpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    existingUser.otp = otp;
    existingUser.otpexpires = otpexpires;

    await existingUser.save();

    // Send OTP via email
    await sendemail(existingUser.email, `Your OTP code is ${otp}`);

    res.send({ Message: "OTP sent to email" });
  } catch (error) {
    res.send({ Message: `Error in connection: ${error}` });
  }
};


exports.verifyotp = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    // First, try to find the user in the 'User' model
    let user = await User.findOne({ email });

    // If not found in 'User', try finding in 'pnyalumini'
    if (!user) {
      user = await pnyalumini.findOne({ email });
      if (!user) {
        return res.send({ Message: "User not found" });
      }
    }

    // Verify if OTP matches and is not expired
    if (user.otp !== otp || user.otpexpires < new Date()) {
      return res.send({ Message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpexpires = undefined;

    // Save the updated user
    await user.save();

    res.send({ Message: "Password reset successfully" });
  } catch (error) {
    res.send({ Message: `Error in connection ${error}` });
  }
};
