const mongoose = require('mongoose')

const enrollmentschema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    Purchase_date: { type: Date, default: Date.now },
    End_date: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
    
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    
});

enrollmentschema.virtual('Time_left').get(function () {
    const today = new Date();
    const diff = this.End_date - today; // in milliseconds
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0); // days left
});

module.exports = mongoose.model('enrollment', enrollmentschema)