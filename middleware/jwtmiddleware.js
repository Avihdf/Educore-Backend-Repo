const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    //Get token of user from cookie 
    const token = req.cookies.user;
   
    if (!token) {
        return res.status(401).json({ error: 'Token not Found Unauthorized' })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({ error: 'Token Experied or Invalid' })
    }
}
