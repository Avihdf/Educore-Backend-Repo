const Course = require('../../models/courses');
const cloudinary = require('cloudinary').v2;

exports.addcourses = async (req, res) => {
    try {

        const { coursetitle, discription, language, coursetime, price, discount } = req.body;

        // Validation
        const errors = [];
        if (!coursetitle || !coursetitle.trim()) errors.push('Course title is required');
        if (!discription || !discription.trim()) errors.push('Description is required');
        if (!language || !language.trim()) errors.push('Language is required');
        if (!coursetime || !coursetime.trim()) errors.push('Course time is required');
        if (price === '' || price === undefined) errors.push('Price is required');
        if (discount === '' || discount === undefined) errors.push('Discount is required');

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // ✅ Get Cloudinary URL for thumbnail
        const thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail');
        const thumbnail = thumbnailFile ? thumbnailFile.path : null;

        // ✅ Parse chapters JSON data
        let chaptersData = [];
        if (req.body.chapters) {
            try {
                chaptersData = JSON.parse(req.body.chapters);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid chapters data format' });
            }
        }

        // ✅ Build chapters with Cloudinary video URLs
        const chapters = chaptersData.map((chapter, index) => {
            const videos = req.files
                .filter(f => f.fieldname === `chaptervideos_${index}`)
                .map(f => f.path); // `f.path` contains Cloudinary URL

            return {
                chaptername: chapter.chaptername,
                chapterduration: chapter.chapterduration,
                chaptervideos: videos
            };
        });


        // ✅ Save course with Cloudinary URLs
        const newCourse = new Course({
            coursetitle,
            discription,
            language,
            coursetime,
            Created_date: new Date(),
            price,
            discount,
            thumbnail,
            chapters
        });

        await newCourse.save();

        return res.status(200).json({
            message: 'Course added successfully',
            course: newCourse
        });
    } catch (err) {
        console.error('Cloudinary Upload Error:', err);
        if (!res.headersSent) {
            return res.status(500).json({
                error: 'Cloudinary Upload Failed',
                details: err.message || err
            });
        }
    }

};
