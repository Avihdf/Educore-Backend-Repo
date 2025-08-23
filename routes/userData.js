const express=require('express');
const router=express.Router();
const jwtmiddleware=require('../middleware/jwtmiddleware')
const adminmiddleware=require('../middleware/adminmiddleware')
const userData= require('../controllers/userDatacontroller')

router.get('/userData',jwtmiddleware,userData.userData)
router.get('/adminData',adminmiddleware,userData.adminData)

module.exports=router