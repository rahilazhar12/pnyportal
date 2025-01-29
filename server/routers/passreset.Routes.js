const express = require('express')
const { Passwordresetrequest, verifyotp, Passwordresetrequestcompany, verifyotpcomapny } = require('../controllers/passwordresetcontroller')


const router = express.Router()



router.post ('/reset-password' , Passwordresetrequest)
router.post ('/reset-password-company' , Passwordresetrequestcompany)
router.post('/verify-otp' , verifyotp)
router.post('/verify-otp-company' , verifyotpcomapny)



module.exports = router