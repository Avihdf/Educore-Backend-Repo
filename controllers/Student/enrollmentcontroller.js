const Enrollment = require('../../models/enrollment'); // Path to your Enrollment model
const Course = require('../../models/courses'); // Optional: To populate course details
const user = require('../../models/user'); // Optional: To populate user details


//Check User is already enroll or not
exports.checkuserenrollalready = async (req, res) => {
  const { user_id, course_id } = req.body;



  // Check if user already enrolled
  const existing = await Enrollment.findOne({ user_id, course_id });
 
  if (existing) {
    return res.status(400).json({ error: 'Already enrolled in this course' });
  }
  return res.json({success:true})

}

// ✅ Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    const enrollment = new Enrollment({
      user_id,
      course_id,

    });

    await enrollment.save();
    return res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
};

// // ✅ Get all enrollments
// exports.getAllEnrollments = async (req, res) => {
//   try {
//     const enrollments = await Enrollment.find()
//       .populate('user_id', 'name email')   // Populate user details
//       .populate('course_id', 'coursetitle price'); // Populate course details

//     return res.status(200).json({ enrollments });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
//   }
// };

// ✅ Get enrollments for a specific user
exports.getUserEnrollments = async (req, res) => {
  try {
    const id = await req.params.id

    const userdetail = await user.findById(id)

    const enrollments = await Enrollment.find({ user_id: id }).populate('course_id')

    return res.status(200).json({ enrollments, userdetail })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
};

