const express = require('express');
const router=express.Router();
const registeruser=require('../controllers/registercontroller');
const loginController = require('../controllers/logincontroller');
const loginwithnumber=require('../controllers/loginwithnumbercontroller')
const forgetpassword=require('../controllers/forgetpasswordcontroller')




// Route to register a new user
router.post('/register', registeruser.registerUser);

//Route for login with E-mail
router.post('/login',loginController.loginformemail);

//Route for login with Mobile Number
router.post("/send-otp", loginwithnumber.sendOtp);

router.post('/verify-mobile-otp',loginwithnumber.verifyOtpAndLogin)

//Route for Forget-Password
router.post('/forget-password/:email',forgetpassword.sendotp);

router.post('/verify-otp/:email',forgetpassword.verifyotp)

router.post("/change-password/:email",forgetpassword.changepassword)


module.exports = router;