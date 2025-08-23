const express=require('express');
const router=express.Router();
const courseplayer=require('../../controllers/Student/courseplayercontroller')
const userjwtmiddleware=require('../../middleware/jwtmiddleware')
const enrollmentcheck=require('../../middleware/enrollmentcheck')


router.get('/courseplayer/:id',userjwtmiddleware,enrollmentcheck,courseplayer.courseplayer)

module.exports=router