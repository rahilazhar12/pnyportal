// import mongoose from "mongoose";
const express = require("express");
const {
  Registermember,
  Login,
  editMember,
  getMember,
} = require("../controllers/membercontroller");
const { requireAuth } = require("../middlewares/requiredauth");

const router = express.Router();

router.post("/member-register", Registermember);
router.post("/member-login", Login);
router.put("/edit", requireAuth, editMember);
router.get("/getmembers", requireAuth , getMember);

module.exports = router;
