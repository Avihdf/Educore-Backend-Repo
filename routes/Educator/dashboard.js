const express=require('express');
const router=express.Router();
const dashboard=require('../../controllers/Educator/dashboardcontroller')
const adminjwtmiddleware=require('../../middleware/adminmiddleware')

router.get('/dashboard',adminjwtmiddleware,dashboard.dashboardelements)


module.exports=router