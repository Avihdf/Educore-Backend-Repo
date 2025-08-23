const user = require('../../models/user')
const enrolluser = require('../../models/enrollment')
const Course = require('../../models/courses')


exports.showregisterstudentlist = async (req, res) => {
    try {
        const studentlist = await user.find({ role: 'student' })

        res.status(200).json({ student: studentlist })


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.showenrollstudentlist = async (req, res) => {
    try {
        const enrollstudent = await enrolluser.find().sort({ _id: -1 })


        const studentdetails = await Promise.all(
            enrollstudent.map(async (e) => {
                const studentdetail = await user.findById(e.user_id);
                const coursedetail = await Course.findById(e.course_id)
                return {
                    enrollment: e,
                    student: studentdetail,
                    course: coursedetail
                };
            })
        );
      

        res.status(200).json({ students: studentdetails });


    } catch (err) {
        console.log(err)
        return res.status(402).json({ error: 'Internal Server Error' + err.message })
    }
}

exports.showenrollstudentlistaftersearch = async (req, res) => {
   const email=req.query.email
   
    
    try {
        const userid=await user.findOne({email})
        const enrollstudent = await enrolluser.find({user_id:userid}).sort({ _id: -1 })

        const studentdetails = await Promise.all(
            enrollstudent.map(async (e) => {
                const studentdetail = await user.findById(e.user_id);
                const coursedetail = await Course.findById(e.course_id)
                return {
                    enrollment: e,
                    student: studentdetail,
                    course: coursedetail
                };
            })
        );

        res.status(200).json({ students: studentdetails });


    } catch (err) {
        console.log(err)
        return res.status(402).json({ error: 'Internal Server Error' + err.message })
    }
}


//CourseWise Enrollmets

exports.showcoursewiseenrollmet=async(req,res)=>{
    try{
        const cou=await Course.find()
        const details=await Promise.all(
            cou.map(async (e)=>{
                const coursedetail=await Course.findById(e._id)
                const total=await enrolluser.find({course_id:e._id}).countDocuments()
                return{
                    coursedetail,
                    totalenrollments:total,

                }
            })
        )
        return res.status(200).json({course:details})

    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal Server Error'+err.message})
    }
}

exports.showstudentlistcoursewise=async(req,res)=>{
    const courseid=req.params.id
    try{
        const studentincourse=await enrolluser.find({course_id:courseid}).sort({ _id: -1 })


        const studentdetails = await Promise.all(
            studentincourse.map(async (e) => {
                const studentdetail = await user.findById(e.user_id);
                const coursedetail = await Course.findById(e.course_id)
                return {
                    enrollment: e,
                    student: studentdetail,
                    course: coursedetail
                };
            })
        );

        res.status(200).json({ students: studentdetails });



    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal Server Error'+err.message})
    }
}