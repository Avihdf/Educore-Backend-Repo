const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    Date_of_Birth:{type:String},
    profile_picture:String,
    password: { type: String, required: true },
    role: { type: String, default: 'student' }, // Default role is 'student'
    date:{type: Date, default: Date.now}
})

module.exports = mongoose.model('users', userschema)