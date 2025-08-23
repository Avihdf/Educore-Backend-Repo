const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const API_KEY = process.env.API_KEY_PHONE;


const otpStore = {}; // { phone: { otp: "123456", expires: Date.now()+300000 } }

// Step 1: Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.findOne({ number: phone })
        if (!user) {
            return res.status(404).json({ success: false, error: "Number not Registered" });
        }

        const phoneWithCode = `+91${phone}`;
        // generate random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        


        await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/${phoneWithCode}/${otp}/:otp_template_name`);
        

        // save OTP in store with expiry (5 minutes)
        otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };
        

        return res.json({ success: true, message: "OTP sent successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error " + err.message });
    }
};

// Step 2: Verify OTP and Login
exports.verifyOtpAndLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;


        if (!otpStore[phone]) {
            return res.status(400).json({ success: false, error: "OTP not found or expired" });
        }

        // check expiry
        if (Date.now() > otpStore[phone].expires) {
            delete otpStore[phone];
            return res.status(400).json({ success: false, error: "OTP expired" });
        }

        // check otp match
        if (otpStore[phone].otp !== otp) {
            return res.status(400).json({ success: false, error: "Invalid OTP" });
        }

        // OTP correct → delete from store
        delete otpStore[phone];

        // get user
        const user = await User.findOne({ number: phone });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // set cookie based on role
        if (user.role === "educator") {
            res.clearCookie("admin");
            res.cookie("admin", token, { httpOnly: true, secure: true });
            return res.status(200).json({
                message: "Welcome Educator " + user.name,
                name: user.name,
                role: user.role,
                success: true,
            });
        }

        res.clearCookie("user");
        res.cookie("user", token, { httpOnly: true, secure: true });

        return res.status(200).json({
            message: "Welcome to Platform " + user.name,
            name: user.name,
            role: user.role,
            success: true,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error " + err.message });
    }
};
