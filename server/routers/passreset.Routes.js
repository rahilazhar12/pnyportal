const express = require('express')
const { Passwordresetrequest, verifyotp } = require('../controllers/passwordresetcontroller')


const router = express.Router()



router.post ('/reset-password' , Passwordresetrequest)
router.post('/verify-otp' , verifyotp)



module.exports = router