const course = require('../../models/courses');

exports.updatecoursedetails = async (req, res) => {
    const { coursetitle, discription, language, coursetime, price, discount } = req.body;
    const courseid = req.params.id;

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

    try {
        // Find course
        const courseData = await course.findById(courseid);
        if (!courseData) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // ✅ If a new thumbnail file is uploaded, update it
        const thumbnailFile = req.files?.find(f => f.fieldname === 'thumbnail');
        if (thumbnailFile) {
            courseData.thumbnail = `thumbnails/${thumbnailFile.filename}`;
        }

        // ✅ Update course fields
        courseData.coursetitle = coursetitle;
        courseData.discription = discription;
        courseData.language = language;
        courseData.coursetime = coursetime;
        courseData.price = price;
        courseData.discount = discount;

        // ✅ Handle new chapters from body
        let newChaptersData = [];
        if (req.body.newChapters) {
            if (typeof req.body.newChapters === "string") {
                newChaptersData = JSON.parse(req.body.newChapters);
            } else {
                newChaptersData = req.body.newChapters;
            }
        }

        newChaptersData.forEach((chapter, index) => {
            const videos = (req.files || [])
                .filter(f => f.fieldname === `newChapters[${index}][chaptervideos]`)
                .map(f => f.path);

            // ✅ Always add as a NEW chapter
            courseData.chapters.push({
                chaptername: chapter.chaptername,
                chapterduration: chapter.chapterduration,
                chaptervideos: videos
            });
        });

        await courseData.save();

        return res.status(200).json({ message: 'Course updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};



//  ✅ Add new chapter
// exports.addChapter = async (req, res) => {
//     const { courseId } = req.params;
//     const { chaptername, chapterduration } = req.body;

//     if (!chaptername || !chapterduration) {
//         return res.status(400).json({ error: "Chapter name and duration are required" });
//     }

//     try {
//         const courseData = await course.findById(courseId);
//         if (!courseData) return res.status(404).json({ error: "Course not found" });

//         // Handle videos if uploaded
//         let videos = [];
//         if (req.files && req.files.length > 0) {
//             videos = req.files.map(f => `coursesuploads/${f.filename}`);
//         }

//         const newChapter = {
//             chaptername,
//             chapterduration,
//             chaptervideos: videos
//         };

//         courseData.chapters.push(newChapter);
//         await courseData.save();

//         res.status(200).json({ message: "Chapter added successfully", chapters: courseData.chapters });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// ✅ Delete a chapter
exports.deleteChapter = async (req, res) => {
    const { courseId, chapterId } = req.params;


    try {
        const courseData = await course.findById(courseId);
        if (!courseData) return res.status(404).json({ error: "Course not found" });

        // Filter out chapter
        courseData.chapters = courseData.chapters.filter(ch => ch._id.toString() !== chapterId);
        await courseData.save();

        res.status(200).json({ message: "Chapter deleted successfully", chapters: courseData.chapters });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
