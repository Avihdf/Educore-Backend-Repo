const user = require('../../models/user');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

exports.updateeducatorprofile = async (req, res) => {
    try {
        const { name, dob } = req.body;
        const admin_id = req.admin.id;

        // Find the educator first
        const educator = await user.findById(admin_id);
        if (!educator) {
            return res.status(404).json({ error: 'Educator not found' });
        }

        // ✅ Handle profile picture upload (Cloudinary URL)
        let profile_picture = educator.profile_picture; // Keep old picture if no new upload
        if (req.file) {
            // Delete old picture from Cloudinary if exists
            if (educator.profile_picture) {
                const oldPublicId = extractPublicId(educator.profile_picture);
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId);
                }
            }

            // Save new Cloudinary URL
            profile_picture = req.file.path;
        }

        // ✅ Update educator data
        await user.findByIdAndUpdate(admin_id, {
            name,
            Date_of_Birth: dob,
            profile_picture
        });

        return res.status(200).json({ message: 'Profile Updated Successfully' });
    } catch (err) {
        console.error('Update Educator Profile Error:', err);
        return res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
};

// Helper to extract Cloudinary public ID from a URL
function extractPublicId(url) {
    if (!url) return null;
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0]; // remove extension
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

// exports.educatorlogout = async (req, res) => {
//     try {
//         res.clearCookie('admin');
//         return res.status(200).json({ message: 'Logout Successfully' })
//     } catch (err) {
//         console.log(err)
//         return res.status(401).json({ error: 'Internal server error : ' + err.message })
//     }
// }

exports.educatorlogout = async (req, res) => {
    try {
        res.clearCookie('admin', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for localhost
            path: '/', // Must match login cookie
        });
        return res.status(200).json({ message: 'Logout Successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
};
