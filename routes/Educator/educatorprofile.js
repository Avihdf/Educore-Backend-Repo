const express=require('express');
const router=express.Router();
const educatormiddleware=require('../../middleware/adminmiddleware')
const educatorprofile=require('../../controllers/Educator/educatorprofilecontroller');
const upload=require('../../middleware/multermiddleware')


router.post('/updateprofile',educatormiddleware,upload.single('profile_picture'),educatorprofile.updateeducatorprofile)

router.post('/updatepassword',educatormiddleware,educatorprofile.updateadminpassword)

router.get('/logout',educatormiddleware,educatorprofile.educatorlogout)

module.exports=router