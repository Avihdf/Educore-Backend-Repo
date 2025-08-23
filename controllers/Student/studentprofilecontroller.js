const user = require('../../models/user')
const bcrpyt = require('bcrypt')

exports.updatestudentprofile = async (req, res) => {

    const { name, dob } = req.body;  // This works now
    const profile_picture = req.file ? req.file.path : null; // File is parsed by Multer


    try {
        const userid = await req.user.id
        await user.findByIdAndUpdate(userid,
            {
                name,
                Date_of_Birth: dob,
                profile_picture,
            })

        // const userdetails=await user.findById(userid)
        // console.log(userdetails.Date_of_Birth)
        return res.status(200).json({ message: 'Profile updated Successfully' })
    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.updatestudentpassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body


    try {
        const userid = await req.user.id

        const userdetails = await user.findById(userid)

        const match = await bcrpyt.compare(current_password, userdetails.password)
        if (!match) {
            return res.status(400).json({ error: 'Current Password is Invalid' })
        }

        if (new_password != confirm_password) {
            return res.status(400).json({ error: `New Password and Confirm Password doesn't match` })
        }

        const hash = await bcrpyt.hash(new_password, 10)

        await user.findByIdAndUpdate(userid, {
            password: hash
        })

        return res.status(200).json({ message: 'Password Updated Successfully' })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.studentlogout = async (req, res) => {
    try {
        res.clearCookie('user');
        return res.status(200).json({ message: 'Logout Successfully' })
    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}