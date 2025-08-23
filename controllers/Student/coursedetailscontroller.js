const course = require('../../models/courses')


exports.courselist = async (req, res) => {
    try {
        const coursedetails = await course.find({Status:'Active'}).sort({ _id: -1 });

        // Map courses to add discountedPrice
        const coursesWithDiscount = coursedetails.map(c => {
            const discountedPrice = c.discount > 0
                ? Math.round(c.price - (c.price * c.discount) / 100)
                : c.price;

            return {
                ...c._doc, // Convert mongoose doc to plain object
                discountedPrice
            };
        });


        return res.status(200).json({ course: coursesWithDiscount });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};





exports.coursedetail = async (req, res) => {
    try {
        const coursedetail = await course.findById(req.params.id);
        if (!coursedetail) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({ coursedetail });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
}
