const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendemail } = require("../utils/otp");

const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.Passwordresetrequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ Message: "User not found" });
    }

    const otp = generateotp();
    const otpexpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpexpires = otpexpires;

    await user.save();

    await sendemail(user.email, `Your OTP code is ${otp}`);

    res.send({ Message: "OTP send to email" });
  } catch (error) {
    res.send({ Message: `Error in connection${error}` });
  }
};

exports.verifyotp = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ Message: "User not found" });
    }

    if (user.otp !== otp || user.otpexpires < new Date()) {
      return res.send({ Message: "Invalid or expire otp" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    user.password = hashedpassword;
    user.otp = undefined;
    user.otpexpires = undefined;
    await user.save();

    res.send({ Message: "Password reset successfully" });
  } catch (error) {
    res.send({ Message: `Error in connection ${error}` });
  }
};
