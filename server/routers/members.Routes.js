// import mongoose from "mongoose";
const express = require('express');
const { Registermember, Login } = require('../controllers/membercontroller');




const router = express.Router()


router.post('/member-register', Registermember)
router.post('/member-login', Login)



module.exports = router;