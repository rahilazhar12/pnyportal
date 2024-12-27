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
    const user = await Member.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    res.status(200).json({
      Message: "Login Success",
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { Registermember, Login };
