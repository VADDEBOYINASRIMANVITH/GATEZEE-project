const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
var ObjectId = require('mongodb').ObjectId;

exports.createNewHod = catchAsync(async (req, res, next) => {
    res.status(200).json({ message: 'createNewHod works' });
});

exports.getSingleHod = catchAsync(async (req, res, next) => {
    /*
    1. Security cant access this route.Remaining all can access.
    2. his branch students can access this route.
    3. his brach employees can use
    4. he can access
    5. admin and superadmin can access
    */
    if (!req.params.id) {
        return next(new AppError('Hod Id is mandatory in the params', 400));
    }

    if (res.locals.userObj.designation === 'security') {
        return next(
            new AppError(`Sorry! You don't have access to get Hod details`, 401)
        );
    }
    let hodObj = await req.app.locals.hodCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!hodObj) {
        return next(
            new AppError('Hod Not Found associated with this Id!', 404)
        );
    }

    if (
        res.locals.userObj.designation === 'hod' &&
        res.locals.userObj.Id !== hodObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get this Hod details from branch ${hodObj.department}`,
                401
            )
        );
    }

    if (
        res.locals.userObj.designation === 'employee' &&
        res.locals.userObj.belongsToHod !== hodObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You are not from the branch of this hod ${hodObj.department}`,
                401
            )
        );
    }

    if (
        res.locals.userObj.designation === 'student' &&
        res.locals.userObj.belongsToHod !== hodObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You are not a from the brach of the ${hodObj.department}`,
                401
            )
        );
    }
    //else all valid only
    return res.status(200).json({ message: 'Success', hodObj: hodObj });
});

exports.getAllHods = catchAsync(async (req, res, next) => {
    /*
    1. Security and student,employee,hod cant access this route.Remaining all can access.
    3. For Admin and super Admin, send all candidates
    */
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student' ||
        res.locals.userObj.designation === 'employee' ||
        res.locals.userObj.designation === 'hod'
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get all hod's details`,
                401
            )
        );
    }
    let allHodsObj = await req.app.locals.hodCol.find().toArray();
    return res.status(200).json({ message: 'Success', allHodsObj: allHodsObj });
});

exports.updateSingleHod = catchAsync(async (req, res, next) => {
    /*
    1. hod can only access this route -> for his phone, his mail, photo.
    2. Admin,superAdmin,security,employee,student cannot access this route.
    */
    if (!req.params.id) {
        return next(new AppError('Hod Id is mandatory in the params', 400));
    }
    if (res.locals.userObj.designation !== 'hod') {
        return next(
            new AppError(
                `Sorry! You don't have access to update hod details`,
                401
            )
        );
    }

    let hodObj = await req.app.locals.hodCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!hodObj) {
        return next(
            new AppError('Hod Not Found associated with this Id!', 404)
        );
    }

    if (res.locals.userObj.Id !== hodObj.Id) {
        return next(
            new AppError(
                `Sorry! You don't have access to update other hod's details.`,
                401
            )
        );
    }

    let email = req.body.email;
    let phone = req.body.phone;
    if (req.file) {
        let imageFileName = req.file.filename;
        await req.app.locals.hodCol.updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: {
                    email: email,
                    phone: phone,
                    imageFileName: imageFileName
                }
            }
        );
    } else {
        await req.app.locals.hodCol.updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: {
                    email: email,
                    phone: phone
                }
            }
        );
    }

    res.status(201).json({ message: 'Updated Successfully' });
});

exports.deleteSingleHod = catchAsync(async (req, res, next) => {
    /*
   1. Only Admin(SSC) can do this route.
   2. deletion means resigned,active,intern etc
   3. Remaining all cant access this route.
    */
    if (!req.params.id) {
        return next(new AppError('Hod Id is mandatory in the params', 400));
    }
    if (res.locals.userObj.designation !== 'admin') {
        return next(
            new AppError(
                `Sorry! You don't have access to delete hod details`,
                401
            )
        );
    }
    let status = req.body.status;
    await req.app.locals.hodCol.updateOne(
        {
            _id: new ObjectId(req.params.id)
        },
        { $set: { status: status } }
    );

    res.status(201).json({ message: `Hod updated with ${status}.` });
});
