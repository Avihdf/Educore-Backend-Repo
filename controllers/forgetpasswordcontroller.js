const user = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt=require('bcrypt')

let otpStore = {}; // temp in-memory store (replace with DB/Redis in production)

exports.sendotp = async (req, res) => {
    const email = req.params.email

    try {
        // Check if user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Configure transporter (Gmail example, use App Password not raw password)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tester9625@gmail.com",   // replace
                pass: "muce ezho hvqj iyki",     // replace
            },
        });

        // Mail content
        const mailOptions = {
            from: "Educore",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}.This OTP is for updating the Passowrd. It will expire in 5 minutes.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Save OTP temporarily
        otpStore[email] = otp;
        setTimeout(() => delete otpStore[email], 5 * 60 * 1000); // expire after 5 min

        return res.json({ success: true, message: "OTP sent successfully to "+ email });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error : " + err.message });
    }
};

// Verify OTP function
exports.verifyotp = async (req, res) => {
    const { email } = req.params;
    const { otp } = req.body
  

    try {
        if (otpStore[email] && otpStore[email] == otp) {
            delete otpStore[email];
            return res.json({ success: true, message: "OTP verified successfully" });
        }
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error : " + err.message });
    }
};


exports.changepassword = async (req, res) => {
    const { email } = req.params;
    const { password } = req.body;
    

    try {
        const userexist = await user.findOne({ email });
        if (!userexist) return res.status(404).json({ message: "User not found" });

        const hash=await bcrypt.hash(password,10)

        userexist.password = hash;
        await userexist.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error : " + err.message });
    }
}


