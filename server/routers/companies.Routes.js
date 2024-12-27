// import mongoose from "mongoose";
const express = require('express');
const { CreateCompany, approvecompanyrequest, LoginCompany, Logoutcompany, VerifyCompany, Getallcompanies } = require('../controllers/Companycontroller');






const router = express.Router()



router.post('/companies-register', CreateCompany);
router.post('/verify-company', VerifyCompany);
router.post('/companies-login', LoginCompany)
router.post('/companies-logout', Logoutcompany);
router.put('/approve-company/:id', approvecompanyrequest);
router.get('/get-all-companies', Getallcompanies)








module.exports = router;