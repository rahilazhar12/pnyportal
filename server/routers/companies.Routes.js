// import mongoose from "mongoose";
const express = require('express');
const { CreateCompany, approvecompanyrequest, LoginCompany, Logoutcompany, VerifyCompany, Getallcompanies, UpdateCompanyProfile, GetCompanyById } = require('../controllers/Companycontroller');
const { requireAuth } = require('../middlewares/requiredauth');








const router = express.Router()



router.post('/companies-register', CreateCompany);
router.put('/updateprofile', requireAuth ,UpdateCompanyProfile);
router.get("/companies", requireAuth , GetCompanyById);
router.post('/verify-company', VerifyCompany);
router.post('/companies-login', LoginCompany)
router.post('/companies-logout', Logoutcompany);
router.put('/approve-company/:id', approvecompanyrequest);
router.get('/get-all-companies', Getallcompanies)








module.exports = router;