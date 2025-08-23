const bcrypt = require('bcrypt');
const user=require('../models/user')

exports.registerUser=async(req,res)=>{
    const { name, email, number, password } = req.body;
    

    try{
         const currentDate = new Date();


        const existingemail = await user.findOne({ email });
        const existingNumber = await user.findOne({ number });
        if(existingemail){
            return res.status(400).json({ error: 'Email already register'});
        }
        if(existingNumber){
            return res.status(400).json({ error: 'Mobile number already register' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            name,
            email,
            number,
            password: hashedPassword,
            date: currentDate
        });
        await newUser.save();
        res.status(201).json({ message: 'Registered successfully now login' });
    }catch(err){
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error'+err.message });
    }
}
