// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = '';

//         if (file.fieldname === 'thumbnail') {
//             folder = path.join(__dirname, '../public/thumbnails/');
//         } else if (file.fieldname.startsWith('chaptervideos')) {
//             folder = path.join(__dirname, '../public/coursesuploads/');
//         } else {
//             folder = path.join(__dirname, '../public/otheruploads/');
//         }

//         fs.mkdirSync(folder, { recursive: true });
//         cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, uniqueName + path.extname(file.originalname));
//     }
// });

// const courseupload = multer({ storage });
// module.exports = courseupload;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'other_uploads';

    if (file.fieldname === 'thumbnail') {
      folder = 'course_thumbnails';
    } else if (file.fieldname.startsWith('chaptervideos')) {
      folder = 'course_videos';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    };
  },
});

const courseUpload = multer({ storage });
module.exports = courseUpload;

