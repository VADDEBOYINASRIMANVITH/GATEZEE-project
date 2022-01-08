const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
var ObjectId = require('mongodb').ObjectId;

exports.createNewSecurity = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'createNewSecurity works' });
});

exports.getSingleSecurity = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'getSingleSecurity works' });
});

exports.getAllSecuritys = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'getAllSecurity works' });
});

exports.updateSingleSecurity = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'updateSingleSecurity works' });
});

exports.deleteSingleSecurity = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'deleteSingleSecurity works' });
});
