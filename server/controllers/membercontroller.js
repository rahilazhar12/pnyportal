const generateTokenAndSetCookie = require("../helpers/generatetoken");
const Member = require("../models/membersmodel");
const bcrypt = require("bcrypt");


const Registermember = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(201).json({ message: "Fill all the fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const newCompany = new Member({
      name,
      email,
      password: hashed,
      role,
    });

    await newCompany.save();
    // Change the response message here
    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await Member.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // Handle invalid credentials
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, user.name, res);

    // Respond with success
    res.status(200).json({
      message: "Login Success",
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMember = async (req, res) => {
  const { id } = req.user;

  try {
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editMember = async (req, res) => {
  const { id } = req.user; // Get member ID from the route parameter
  const { name, email, password, role } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Member ID is required" });
  }

  try {
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update fields if provided
    if (name) member.name = name;
    if (email) member.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      member.password = hashed;
    }
    if (role) member.role = role;

    await member.save();
    res.status(200).json({ message: "Member details updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { Registermember, Login , editMember , getMember };
