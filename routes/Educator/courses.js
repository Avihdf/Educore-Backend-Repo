const express=require('express');
const router=express.Router();
const adminjwtmiddleware=require('../../middleware/adminmiddleware')
const coursedetails=require('../../controllers/Educator/courselistcontroller')
const updatedcourse=require('../../controllers/Educator/editcoursecontoller')
const courseupload=require('../../middleware/coursemultermiddleware')

router.get('/courselist',adminjwtmiddleware,coursedetails.courselist)

router.get('/course/:id',adminjwtmiddleware,coursedetails.coursedetail)

//route for change status of course between active/inactive
router.post('/coursestatus/:id',adminjwtmiddleware,coursedetails.changeStatusofcourse)

//route for edit course details
router.post('/updatecourse/:id',adminjwtmiddleware,courseupload.any(),updatedcourse.updatecoursedetails)

// router.post("/courses/:courseId/add-chapter",courseupload.array("chaptervideos", 10), updatedcourse.addChapter);

router.delete("/course/:courseId/chapters/:chapterId",adminjwtmiddleware,updatedcourse.deleteChapter);

//route for delete course
router.delete('/deletecourse/:id',adminjwtmiddleware,coursedetails.deletecourse)


module.exports=router