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
      transformation: file.mimetype.startsWith('image')
        ? [{ quality: "auto", fetch_format: "auto" }] // Compress images
        : undefined,
    };
  },
});

const courseUpload = multer({ storage });
module.exports = courseUpload;

