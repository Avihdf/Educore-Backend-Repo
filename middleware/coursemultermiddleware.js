// const multer = require('multer');
// const path = require('path');

// // Configure storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, 'server/public/coursesuploads/');
//     },
//     filename: (req, file, cb)=> {
//         const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, name + path.extname(file.originalname));
//     }
// });

// const courseupload = multer({ storage });

// module.exports = courseupload;
// middleware/coursemultermiddleware.js
// middleware/coursemultermiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        if (file.fieldname === 'thumbnail') {
            folder = path.join(__dirname, '../public/thumbnails/');
        } else if (file.fieldname.startsWith('chaptervideos')) {
            folder = path.join(__dirname, '../public/coursesuploads/');
        } else {
            folder = path.join(__dirname, '../public/otheruploads/');
        }

        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const courseupload = multer({ storage });
module.exports = courseupload;
