const express = require('express')
const router = express.Router();
const enrollment = require('../../controllers/Student/enrollmentcontroller')
const userjwtmiddleware=require('../../middleware/jwtmiddleware')

router.post('/check-user-already-enroll',userjwtmiddleware,enrollment.checkuserenrollalready)

router.post('/enrollment',userjwtmiddleware,enrollment.createEnrollment);

router.get('/userenrollment/:id',userjwtmiddleware,enrollment.getUserEnrollments)


module.exports = router