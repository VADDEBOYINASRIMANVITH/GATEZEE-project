const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const path = require('path');

exports.getUserFile = catchAsync(async (req, res, next) => {
    let filename = req.body.filename;

    res.status(200).sendFile(
        path.join(__dirname, `../public/userFile/${filename}`)
    );
});

exports.getUserImage = catchAsync(async (req, res, next) => {
    let filename = req.body.filename;

    res.status(200).sendFile(
        path.join(__dirname, `../public/userImage/${filename}`)
    );
});
