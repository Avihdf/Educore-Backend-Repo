const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.loginformemail = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existuser = await user.findOne({ email });

        if (!existuser) {
            return res.status(400).json({ error: 'Email is not registered' });
        }

        const match = await bcrypt.compare(password, existuser.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: existuser._id, role: existuser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
                

        if (existuser.role==='educator') {
            res.clearCookie('admin');
            res.cookie('admin',token,{httpOnly:true,Credential:true,secure: true,sameSite:'none'})
            return res.status(200).json(
            {
                message: 'Welcome Educator ' + existuser.name,
                name:existuser.name,
                role: existuser.role,
                success:true,  
            });
        }

        res.clearCookie('user');
        res.cookie('user',token,{httpOnly:true,Credential:true,secure: true,sameSite:'none'})
        
       
        return res.status(200).json(
            {
                message: 'Welcome to Platform ' + existuser.name,
                name:existuser.name,
                role: existuser.role,
                success:true,
            });

    } catch (err) {
        console.error('Error On Login user:', err);
        return res.status(500).json(
            {
                error: 'Internal server error: ' + err.message
            });
    }
};


