const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/public/uploads/');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, name + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;
