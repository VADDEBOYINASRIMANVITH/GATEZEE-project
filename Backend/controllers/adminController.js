const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
var ObjectId = require('mongodb').ObjectId;

exports.createNewAdmin = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'createNewAdmin works' });
});

exports.getSingleAdmin = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'getSingleAdmin works' });
});

exports.getAllAdmins = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'getAllAdmin works' });
});

exports.updateSingleAdmin = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'updateSingleAdmin works' });
});

exports.deleteSingleAdmin = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'deleteSingleAdmin works' });
});
