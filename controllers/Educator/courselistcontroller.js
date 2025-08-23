const course = require('../../models/courses')
exports.courselist = async (req, res) => {
    try {
        const coursedetails = await course.find().sort({ _id: -1 });

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
   
    const courseid=req.params.id
    try {
        const coursedetail = await course.findById(courseid);
        
        if (!coursedetail) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({coursedetail });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
}

exports.changeStatusofcourse=async(req,res)=>{
    const{status}=req.body

    const courseid=req.params.id

    try{
        await course.findByIdAndUpdate(courseid,{Status:status})

        return res.status(200).json({message:'Course is now '+status})

    }catch(err){
        console.log(err)
        rres.status(402).json({error:'Internal Server Error'+err.message})
    }
}

exports.deletecourse=async (req,res)=>{
    try{
        const courseid=req.params.id
      
        await course.findByIdAndDelete(courseid)

        return res.status(200).json({message:'Course Delete Successfully'})
    }catch(err){
        console.log(err)
        res.status(402).json({error:'Internal Server Error'+err.message})
    }
}