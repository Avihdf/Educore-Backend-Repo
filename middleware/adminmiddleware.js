const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    //Get token of Admin from cookie 
    const admintoken = req.cookies.admin;
    // console.log(req.cookies.admin)
    if (!admintoken) {
        return res.status(401).json({ error: 'Token not Found Unauthorized' })
    }

    try {

        const decoded = jwt.verify(admintoken, process.env.JWT_SECRET);
        req.admin = decoded;
        // console.log(req.admin)
        next();

    } catch (err) {

        return res.status(401).json({ error: 'Token Experied or Invalid' })
    }
}
