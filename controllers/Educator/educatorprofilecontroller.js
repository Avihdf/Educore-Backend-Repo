const user = require('../../models/user')
const bcrypt = require('bcrypt')

exports.updateeducatorprofile = async (req, res) => {
    
    const { name, dob } = req.body;  // This works now
    const profile_picture = req.file ? req.file.filename : null; // File is parsed by Multer

    
    try {
        const admin_id = await req.admin.id
       
        await user.findByIdAndUpdate(admin_id,
            {
                name,
                Date_of_Birth: dob,
                profile_picture,
            })

        return res.status(200).json({ message: 'Profile Updated Successfully' })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.updateadminpassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body
    
    try {
        const adminid = await req.admin.id

        const admindetails = await user.findById(adminid)
      
        const match = await bcrypt.compare(current_password,admindetails.password )
        if (!match) {
            return res.status(400).json({ error: 'Current Password is Invalid' })
        }

        if (new_password != confirm_password) {
            return res.status(400).json({ error: `New Password and Confirm Password doesn't match` })
        }

        const hash = await bcrypt.hash(new_password, 10)

        await user.findByIdAndUpdate(adminid, {
            password: hash
        })

        return res.status(200).json({message:'Password Updated Successfully'})

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.educatorlogout = async (req, res) => {
    try {
        res.clearCookie('admin');
        return res.status(200).json({ message: 'Logout Successfully' })
    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}