const express=require('express');
const router=express.Router();
const studentlist=require('../../controllers/Educator/studentlistcontroller')
const adminjwtmiddleware=require('../../middleware/adminmiddleware')

router.get('/student-list',adminjwtmiddleware,studentlist.showregisterstudentlist)

router.get('/enrollstudent-list',adminjwtmiddleware,studentlist.showenrollstudentlist)

router.get('/enrollstudent-search',adminjwtmiddleware,studentlist.showenrollstudentlistaftersearch)

//get enroll student course wise
router.get('/coursewise-enrollmet',adminjwtmiddleware,studentlist.showcoursewiseenrollmet)

router.get('/students-in-course/:id',adminjwtmiddleware,studentlist.showstudentlistcoursewise)

module.exports = router;