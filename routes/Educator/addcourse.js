const express = require('express');
const router = express.Router();
const courseupload = require('../../middleware/coursemultermiddleware')
const addcourse = require('../../controllers/Educator/addcoursecontroller')
const adminjwtmiddleware=require('../../middleware/adminmiddleware')

router.post('/addcourse',adminjwtmiddleware,
    courseupload.any(),
    addcourse.addcourses)

module.exports = router
