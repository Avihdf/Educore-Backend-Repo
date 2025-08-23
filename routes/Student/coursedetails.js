const express=require('express');
const router=express.Router();
const coursedetails=require('../../controllers/Student/coursedetailscontroller')


router.get('/courselist',coursedetails.courselist)
router.get('/course/:id',coursedetails.coursedetail)


module.exports=router