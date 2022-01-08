const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./appError');
const maxPhotoSize = 500000;
// const  multerStorage = multer.diskStorage({
//      destination: function (req, file, cb) {
//           cb(null, 'public/userImage')
//      },

//      filename: function (req, file, cb) {
//           const ext = file.mimetype.split('/')[1];

//           cb(null, `${req.userId}-${Date.now()}.${ext}`)
//      }
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new AppError('File should be either jpeg or png'), false);
    }
};
//
// dist:'/public/userImage'
// storage: multerStorage, fileFilter: multerFilter, limits:{fileSize:maxPhotoSize}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `${req.userId}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/userImage/${req.file.filename}`);
    next();
};
