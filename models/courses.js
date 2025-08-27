const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    chaptername: { type: String},
    chapterduration: { type: String },
    chaptervideos: [{ type: String }] // Array of video file paths
});

const courseSchema = new mongoose.Schema({
    coursetitle: { type: String, required: true },
    discription: { type: String },
    language: { type: String },
    coursetime: { type: String },
    Created_date: { type: Date, default: Date.now },
    price: { type: Number },
    discount: { type: Number },
    Status:{type:String,default:'Inactive'},
    thumbnail: { type: String },          // Path to thumbnail
    chapters: [chapterSchema]             // Array of chapters
});

module.exports = mongoose.model('course', courseSchema);

