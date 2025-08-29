const user = require('../../models/user');
const bcrypt=require('bcrypt')
const cloudinary = require('cloudinary').v2;

exports.updatestudentprofile = async (req, res) => {
    try {
        const { name, dob } = req.body;

        // Get user ID based on role
        const userId = req.user?.id || req.admin?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID not found' });
        }

        // Find user
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Handle profile picture
        let profile_picture = existingUser.profile_picture; // keep current if no new upload
        if (req.file) {
            // Delete old picture if exists
            if (existingUser.profile_picture) {
                const oldPublicId = extractPublicId(existingUser.profile_picture);
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId);
                }
            }
            profile_picture = req.file.path; // Save Cloudinary URL of new image
        }

        // Update user profile
        await user.findByIdAndUpdate(userId, {
            name,
            Date_of_Birth: dob,
            profile_picture,
        });

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Update Profile Error:', err);
        return res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
};

// Helper function to extract Cloudinary public ID from URL
function extractPublicId(url) {
    if (!url) return null;
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0];
}


exports.updatestudentpassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body


    try {
        const userid = await req.user.id

        const userdetails = await user.findById(userid)

        const match = await bcrypt.compare(current_password, userdetails.password)
        if (!match) {
            return res.status(400).json({ error: 'Current Password is Invalid' })
        }

        if (new_password != confirm_password) {
            return res.status(400).json({ error: `New Password and Confirm Password doesn't match` })
        }

        const hash = await bcrypt.hash(new_password,10)

        await user.findByIdAndUpdate(userid, {
            password: hash
        })

        return res.status(200).json({ message: 'Password Updated Successfully' })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

// exports.studentlogout = async (req, res) => {
//     try {
//         res.clearCookie('user');
//         return res.status(200).json({ message: 'Logout Successfully' })
//     } catch (err) {
//         console.log(err)
//         return res.status(401).json({ error: 'Internal server error : ' + err.message })
//     }
// }

exports.studentlogout = async (req, res) => {
    try {
        res.clearCookie('user', {
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
