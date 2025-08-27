const course = require('../../models/courses');
const cloudinary = require('cloudinary').v2;

exports.updatecoursedetails = async (req, res) => {
    const { coursetitle, discription, language, coursetime, price, discount } = req.body;
    const courseid = req.params.id;

    // Fix: Proper logging
    // console.log('Body:', JSON.stringify(req.body, null, 2));
    // console.log('Files:', req.files?.map(f => ({ fieldname: f.fieldname, filename: f.filename })) || 'No files');

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
        const courseData = await course.findById(courseid);
        if (!courseData) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Handle thumbnail update
        const thumbnailFile = req.files?.find(f => f.fieldname === 'thumbnail');
        if (thumbnailFile) {
            if (courseData.thumbnail) {
                const oldThumbPublicId = extractPublicId(courseData.thumbnail);
                if (oldThumbPublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldThumbPublicId);
                    } catch (cloudinaryError) {
                        console.log('Error deleting old thumbnail:', cloudinaryError);
                    }
                }
            }
            courseData.thumbnail = thumbnailFile.path;
        }

        // Update basic course info
        courseData.coursetitle = coursetitle;
        courseData.discription = discription;
        courseData.language = language;
        courseData.coursetime = coursetime;
        courseData.price = price;
        courseData.discount = discount;

        // Parse new chapters
        let newChaptersData = [];
        if (req.body.newChapters) {
            try {
                newChaptersData = typeof req.body.newChapters === "string"
                    ? JSON.parse(req.body.newChapters)
                    : req.body.newChapters;

                // console.log('Parsed newChaptersData:', JSON.stringify(newChaptersData, null, 2));
            } catch (err) {
                console.error('Error parsing newChapters:', err);
                return res.status(400).json({ error: 'Invalid newChapters format' });
            }
        }

        // Process each new chapter
        if (newChaptersData && Array.isArray(newChaptersData)) {
            for (let index = 0; index < newChaptersData.length; index++) {
                const chapter = newChaptersData[index];

                // Find videos for this specific chapter
                const chapterVideos = (req.files || [])
                    .filter(f => f.fieldname === `chapterVideos_${index}[]`)
                    .map(f => f.path); // Cloudinary URLs

                // console.log(`Chapter ${index} videos:`, chapterVideos);

                // Add chapter to course
                const newChapter = {
                    chaptername: chapter.chaptername,
                    chapterduration: chapter.chapterduration,
                    chaptervideos: chapterVideos
                };

                courseData.chapters.push(newChapter);
                // console.log(`Added chapter ${index}:`, newChapter);
            }
        }

        // Save the updated course
        const savedCourse = await courseData.save();
        

        return res.status(200).json({
            message: 'Course updated successfully',
            course: savedCourse
        });

    } catch (err) {
        console.error('Update Error Details:', err);
        res.status(500).json({
            error: 'Internal Server Error: ' + err.message,
            details: err.stack
        });
    }
};

// Helper to extract Cloudinary public ID from URL
function extractPublicId(url) {
    if (!url) return null;
    try {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        return fileName.split('.')[0];
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
}



// ✅ Delete a chapter
// exports.deleteChapter = async (req, res) => {
//     const { courseId, chapterId } = req.params;


//     try {
//         const courseData = await course.findById(courseId);
//         if (!courseData) return res.status(404).json({ error: "Course not found" });

//         // Filter out chapter
//         courseData.chapters = courseData.chapters.filter(ch => ch._id.toString() !== chapterId);
//         await courseData.save();

//         res.status(200).json({ message: "Chapter deleted successfully", chapters: courseData.chapters });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

exports.deleteChapter = async (req, res) => {
    const { courseId, chapterId } = req.params;

    try {
        const courseData = await course.findById(courseId);
        if (!courseData) return res.status(404).json({ error: "Course not found" });

        // Find the chapter to delete
        const chapterToDelete = courseData.chapters.find(ch => ch._id.toString() === chapterId);
        if (!chapterToDelete) return res.status(404).json({ error: "Chapter not found" });

        // ✅ Delete videos from Cloudinary
        for (const videoUrl of chapterToDelete.chaptervideos) {
            const publicId = extractPublicId(videoUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
            }
        }

        // Remove chapter from DB
        courseData.chapters = courseData.chapters.filter(ch => ch._id.toString() !== chapterId);
        await courseData.save();

        res.status(200).json({ message: "Chapter deleted successfully", chapters: courseData.chapters });
    } catch (err) {
        console.error('Delete Chapter Error:', err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

