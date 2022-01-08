const multer = require('multer');
const AppError = require('./appError');
const typeOfFile = require('./typeOfFile').typeOfFile;
const generateRandomFile = require('./typeOfFile').generateRandomFile;
const maxFileSize = 1000000;

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/userFile');
    },

    filename: function (req, file, cb) {
        const ext = typeOfFile(file.mimetype);
        const filename = generateRandomFile();

        cb(null, `${filename}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'application/pdf' ||
        file.mimetype == 'application/msword' ||
        file.mimetype ==
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype == 'text/plain'
    ) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                'File should be either image(jpg,png,jpeg) or pdf or doc or text '
            ),
            false
        );
    }
};

// { storage: multerStorage, fileFilter: multerFilter}

// ,limits:{fileSize:maxFileSize}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserFile = upload.any();
