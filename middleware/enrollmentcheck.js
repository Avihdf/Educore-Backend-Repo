// middleware/checkEnrollment.js
const Enrollment = require('../models/enrollment');

const checkEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.id; // from jwtMiddleware
   
    const courseId = req.params.id;
    

    // Check if the user is enrolled
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        error: 'Access denied: You are not enrolled in this course',
      });
    }

    next(); // User is enrolled, continue
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = checkEnrollment;
