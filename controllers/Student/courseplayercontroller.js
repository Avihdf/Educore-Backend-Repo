const course=require('../../models/courses')

exports.courseplayer=async(req,res)=>{
    try{
        const courseid= req.params.id
        const courseplayer=await course.findById(courseid)

        return res.status(200).json({courseplayer,player:true});

    }catch(err){
        console.log(err)
        return res.status(500).json({error:'Internal Server error'+err.message})
    }
}