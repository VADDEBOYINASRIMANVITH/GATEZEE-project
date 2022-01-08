const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
var ObjectId = require('mongodb').ObjectId;

exports.createNewStudent = catchAsync(async (req, res, next) => {
    /*
    1. Admin (SSC) can create New Students every year.
    2. They can create students by giving Id,first time password (Welcome@123) and update relevant details related to password,and more details
    3. Apart from them, no one is allowed to create a New Student.
    */
    res.status(200).json({ message: 'createNewStudent works' });
});

exports.getSingleStudent = catchAsync(async (req, res, next) => {
    /*
    1. Security cant access this route.Remaining all can access.
    2. For other valid users, send studentObj and Image file.
    */
    if (!req.params.id) {
        return next(new AppError('Student Id is mandatory in the params', 400));
    }
    if (res.locals.userObj.designation === 'security') {
        return next(
            new AppError(
                `Sorry! You don't have access to get single student details`,
                401
            )
        );
    }

    let studentMongoId = req.params.id;
    let studentObj = await req.app.locals.studentCol.findOne({
        _id: new ObjectId(studentMongoId)
    });

    if (!studentObj) {
        return next(
            new AppError('Student Not Found associated with this Id!', 404)
        );
    }

    //If it is Employee check whether this student is associated or not.
    if (
        res.locals.userObj.designation === 'employee' &&
        res.locals.userObj.Id !== studentObj.belongsToEmployee
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get this student details`,
                401
            )
        );
    }
    //If is is Hod, check whether this student is associated or not
    if (
        res.locals.userObj.designation === 'hod' &&
        res.locals.userObj.Id !== studentObj.belongsToHod
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get this student details`,
                401
            )
        );
    }
    //If it is student, check whether he is not other student
    if (
        res.locals.userObj.designation === 'student' &&
        res.locals.userObj.Id !== studentObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get other student's details`,
                401
            )
        );
    }

    //else all valid only
    return res.status(200).json({ message: 'Success', studentObj: studentObj });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
    /*
    1. Security and student cant access this route.Remaining all can access.
    2. For Employee and Hod send their associated candidates. not photo files
    3. For Admin and super Admin, send all candidates
    */
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student'
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get all student details`,
                401
            )
        );
    }

    if (res.locals.userObj.designation === 'employee') {
        let allStudents = await req.app.locals.studentCol
            .find({ belongsToEmployee: res.locals.userObj.Id })
            .toArray();

        return res
            .status(200)
            .json({ message: 'Success', allStudentsObj: allStudents });
    } else if (res.locals.userObj.designation === 'hod') {
        let allStudents = await req.app.locals.studentCol
            .find({ belongsToHod: res.locals.userObj.Id })
            .toArray();

        return res
            .status(200)
            .json({ message: 'Success', allStudentsObj: allStudents });
    } else {
        let allStudents = await req.app.locals.studentCol.find().toArray();
        return res
            .status(200)
            .json({ message: 'Success', allStudentsObj: allStudents });
    }
});

exports.updateSingleStudent = catchAsync(async (req, res, next) => {
    /*
    1. Student can only access this route -> for ,4 fields
    2. His mentor employee can change parentPhone number.
    3. Admin,superAdmin,security,Hod cannot access this route.
    */
    if (!req.params.id) {
        return next(new AppError('Student Id is mandatory in the params', 400));
    }
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'admin' ||
        res.locals.userObj.designation === 'superadmin' ||
        res.locals.userObj.designation === 'hod'
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to update student details`,
                401
            )
        );
    }

    let studentMongo = req.params.id;
    let studentObj = await req.app.locals.studentCol.findOne({
        _id: new ObjectId(studentMongo)
    });
    if (!studentObj) {
        return next(
            new AppError('Student Not Found associated with this Id!', 404)
        );
    }

    if (res.locals.userObj.designation === 'employee') {
        if (studentObj.belongsToEmployee !== res.locals.userObj.Id) {
            return next(
                new AppError(
                    `Sorry! You don't have access to update this student's details.`,
                    401
                )
            );
        }
        let parentPhone = req.body.parentPhone;
        await req.app.locals.studentCol.updateOne(
            {
                _id: new ObjectId(studentMongo)
            },
            { $set: { parentPhone: parentPhone } }
        );

        res.status(201).json({ message: 'Updated Successfully' });
    }

    if (res.locals.userObj.designation === 'student') {
        if (studentObj.Id !== res.locals.userObj.Id) {
            return next(
                new AppError(
                    `Sorry! You don't have access to update other student's details.`,
                    401
                )
            );
        }
        let email = req.body.email;
        let phone = req.body.phone;
        let parentEmail = req.body.parentEmail;
        if (req.file) {
            let imageFileName = req.file.filename;
            await req.app.locals.studentCol.updateOne(
                {
                    _id: new ObjectId(studentMongo)
                },
                {
                    $set: {
                        email: email,
                        phone: phone,
                        parentEmail: parentEmail,
                        imageFileName: imageFileName
                    }
                }
            );
        } else {
            await req.app.locals.studentCol.updateOne(
                {
                    _id: new ObjectId(studentMongo)
                },
                {
                    $set: {
                        email: email,
                        phone: phone,
                        parentEmail: parentEmail
                    }
                }
            );
        }

        res.status(201).json({ message: 'Updated Successfully' });
    }
});

exports.deleteSingleStudent = catchAsync(async (req, res, next) => {
    /*
   1. Only Admin(SSC) can do this route.
   2. deletion means passout,dropout,detained
   3. Remaining all cant access this route.
    */
    if (!req.params.id) {
        return next(new AppError('Student Id is mandatory in the params', 400));
    }
    if (res.locals.userObj.designation !== 'admin') {
        return next(
            new AppError(
                `Sorry! You don't have access to delete student details`,
                401
            )
        );
    }
    let status = req.body.status;
    await req.app.locals.studentCol.updateOne(
        {
            _id: new ObjectId(req.params.id)
        },
        { $set: { status: status } }
    );

    res.status(201).json({ message: `Student updated with ${status}.` });
});
