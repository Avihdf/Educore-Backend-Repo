const user = require('../../models/user')
const course = require('../../models/courses')
const courseenrollment = require('../../models/enrollment')


exports.dashboardelements = async (req, res) => {
    try {
        const totaluser = await user.find().countDocuments({ role: 'student' })
        const totaleducator = await user.find().countDocuments({ role: 'educator' })
        const totalcourse = await course.find().countDocuments()
        const totalenrollment = await courseenrollment.find().countDocuments()
        const enrollments = await courseenrollment.find().populate('course_id', 'price discount');

        let totalRevenue = 0;

        enrollments.forEach(enrollment => {
            const course = enrollment.course_id;
            if (course) {
                // If discount exists, apply it
                const finalPrice = course.discount
                    ? course.price - (course.price * course.discount) / 100
                    : course.price;

                totalRevenue += finalPrice;
            }
        });



        res.status(200).json({
            user: totaluser,
            educator: totaleducator,
            courses: totalcourse,
            enrollment: totalenrollment,
            revenue: totalRevenue.toFixed(2)
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' + err.message });
    }
}