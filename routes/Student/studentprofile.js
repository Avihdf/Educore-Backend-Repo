const express=require('express');
const router=express.Router();
const usermiddleware=require('../../middleware/jwtmiddleware')
const upload=require('../../middleware/multermiddleware')
const studentprofile=require('../../controllers/Student/studentprofilecontroller')


router.post('/updateprofile',usermiddleware,upload.single('profile_picture'),studentprofile.updatestudentprofile)

router.post('/updatepassword',usermiddleware,studentprofile.updatestudentpassword)

router.get('/logout',usermiddleware,studentprofile.studentlogout)

module.exports=router