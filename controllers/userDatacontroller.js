const User = require('../models/user')

exports.userData = async (req, res) => {
    try {

        const userdetais = await User.findById(req.user.id)
        return res.json({ user:userdetais })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}

exports.adminData = async (req, res) => {
    try {

        const admindetails = await User.findById(req.admin.id)
        return res.json({ admin:admindetails })

    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'Internal server error : ' + err.message })
    }
}