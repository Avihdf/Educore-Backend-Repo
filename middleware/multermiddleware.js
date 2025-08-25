// const multer = require('multer');
// const path = require('path');

// // Configure storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'server/public/uploads/');
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, name + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'general_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
    resource_type: 'auto',
    transformation: [{ quality: "auto", fetch_format: "auto" }] ,
  },
});

const upload = multer({ storage });
module.exports = upload;

