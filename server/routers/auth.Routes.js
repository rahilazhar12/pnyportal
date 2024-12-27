// import mongoose from "mongoose";
const express = require("express");
const {
  UserRegistration,
  UserLogin,
  Profileregister,
  Getprofile,
  updateProfile,
  verifyCode,
  Getallusers,
  Getallpnyalumini,
  EditUser,
  Logoutuser,
  GetUserById,
  GetPNYAlumniById,
} = require("../controllers/Users");
const { ApplyForJob } = require("../controllers/aplicationcontroller");
const { requireAuth, requireAuthedit } = require("../middlewares/requiredauth");
const upload = require("../multer/imgConfig.js");
const checkProfileExists = require("../middlewares/checkProfileExists.js");

const router = express.Router();

router.post("/register-user", UserRegistration);
router.get("/get-all-users", Getallusers);
router.get("/get-info-byid", requireAuth, GetUserById);
router.put(
  "/edit-user",
  upload.single("profilePicture"),
  requireAuthedit,
  EditUser
);
router.post("/verify-code", verifyCode);
router.post("/user-login", UserLogin);
router.post("/jobs/apply/:jobId", requireAuth, checkProfileExists, ApplyForJob);
router.post(
  "/profile",
  requireAuth,
  upload.single("profilePicture"),
  Profileregister
);
router.put("/updateprofile/:id", updateProfile);
router.get("/getprofile/:id", Getprofile);
router.get("/get-all-pnyalumini", Getallpnyalumini);
router.post("/logoutuser", Logoutuser);

module.exports = router;
