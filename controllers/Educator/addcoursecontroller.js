const Course = require('../../models/courses');


// exports.addcourses = async (req, res) => {
// const {coursetitle,discription,language,coursetime,price,discount}=req.body
// const{thumbnail,chaptervideos}=req.files
// const date=new Date()
// try{
//     const newcourse=await new Course({
//         coursetitle,discription,language,coursetime,Created_date:date,price,discount
//     })

//     await newcourse.save()

// return res.status(200).json({ message: 'Course added successfully' });


exports.addcourses = async (req, res) => {


    try {
        const { coursetitle, discription, language, coursetime, price, discount } = req.body;

        const errors = [];

        if (!coursetitle || !coursetitle.trim()) errors.push('Course title is required');
        if (!discription || !discription.trim()) errors.push('Description is required');
        if (!language || !language.trim()) errors.push('Language is required');
        if (!coursetime || !coursetime.trim()) errors.push('Course time is required');
        if (price === '' || price === undefined) errors.push('Price is required');
        if (discount === '' || discount === undefined) errors.push('Discount is required');

        if (errors.length > 0) {
            return res.status(400).json({ errors }); // ✅ Send all errors
        }



        // Thumbnail
       const thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail');
        const thumbnail = thumbnailFile
            ? `thumbnails/${thumbnailFile.filename}`
            : null;

        // Parse chapters JSON
        let chaptersData = [];
        if (req.body.chapters) {
            chaptersData = JSON.parse(req.body.chapters);
        }

        // Build chapters array with videos
        const chapters = chaptersData.map((chapter, index) => {
            // Filter all files for this chapter
            const videos = req.files
                .filter(f => f.fieldname === `chaptervideos_${index}`)
                .map(f => f.path);

            return {
                chaptername: chapter.chaptername,
                chapterduration: chapter.chapterduration,
                chaptervideos: videos
            };
        });


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


        return res.status(200).json({ message: 'Course added successfully', course: newCourse });
    } catch (err) {
        console.error('Internal server error:', err);
        if (!res.headersSent) {  // ✅ Prevent double response
            return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
        }
    }
};
