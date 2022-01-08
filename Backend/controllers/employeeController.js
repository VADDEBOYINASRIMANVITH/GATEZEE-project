const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
var ObjectId = require('mongodb').ObjectId;

exports.createNewEmployee = catchAsync(async (req, res, next) => {
    /*
    1. Admin (SSC) can create New Employee upon joining.
    2. They can create Employee by giving Id,first time password (Welcome@123) and update relevant details related to password,and more details
    3. Apart from them, no one is allowed to create a New Employee.
    */
    res.status(200).json({ message: 'createNewEmployee works' });
});

exports.getSingleEmployee = catchAsync(async (req, res, next) => {
    /*
    1. Security cant access this route.Remaining all can access.
    2. his mentees can access this route.
    3. his Hod can use
    4. he can access
    5. admin and superadmin can access
    */
    if (!req.params.id) {
        return next(
            new AppError('Employee Id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation === 'security') {
        return next(
            new AppError(
                `Sorry! You don't have access to get single employee details`,
                401
            )
        );
    }

    let employeeObj = await req.app.locals.employeeCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!employeeObj) {
        return next(
            new AppError('Employee Not Found associated with this Id!', 404)
        );
    }

    if (
        res.locals.userObj.designation === 'employee' &&
        res.locals.userObj.Id !== employeeObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get this employee details`,
                401
            )
        );
    }

    if (
        res.locals.userObj.designation === 'hod' &&
        res.locals.userObj.Id !== employeeObj.belongsToHod
    ) {
        return next(
            new AppError(
                `Sorry! You are not the HOD of the branch ${employeeObj.department}`,
                401
            )
        );
    }

    if (
        res.locals.userObj.designation === 'student' &&
        res.locals.userObj.belongsToEmployee !== employeeObj.Id
    ) {
        return next(
            new AppError(
                `Sorry! You are not a mentee of the employee ${employeeObj.Id}`,
                401
            )
        );
    }

    //else all valid only
    return res
        .status(200)
        .json({ message: 'Success', employeeObj: employeeObj });
});

exports.getAllEmployees = catchAsync(async (req, res, next) => {
    /*
    1. Security and student,employee cant access this route.Remaining all can access.
    2. For Hod send their associated candidates. not photo files
    3. For Admin and super Admin, send all candidates
    */
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student' ||
        res.locals.userObj.designation === 'employee'
    ) {
        return next(
            new AppError(
                `Sorry! You don't have access to get all employees details`,
                401
            )
        );
    }

    if (res.locals.userObj.designation === 'hod') {
        let allEmployeesObj = await req.app.locals.employeeCol
            .find({ belongsToHod: res.locals.userObj.Id })
            .toArray();

        return res
            .status(200)
            .json({ message: 'Success', allEmployeesObj: allEmployeesObj });
    }

    let allEmployeesObj = await req.app.locals.employeeCol.find().toArray();
    return res
        .status(200)
        .json({ message: 'Success', allEmployeesObj: allEmployeesObj });
});

exports.updateSingleEmployee = catchAsync(async (req, res, next) => {
    /*
    1. Employee can only access this route -> for his phone, his mail, photo.
    2. Admin,superAdmin,security,Hod,student cannot access this route.
    */
    if (!req.params.id) {
        return next(
            new AppError('Employee Id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'employee') {
        return next(
            new AppError(
                `Sorry! You don't have access to update employee details`,
                401
            )
        );
    }

    let employeeObj = await req.app.locals.employeeCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!employeeObj) {
        return next(
            new AppError('Employee Not Found associated with this Id!', 404)
        );
    }

    if (res.locals.userObj.Id !== employeeObj.Id) {
        return next(
            new AppError(
                `Sorry! You don't have access to update other employee's details.`,
                401
            )
        );
    }

    let email = req.body.email;
    let phone = req.body.phone;
    if (req.file) {
        let imageFileName = req.file.filename;
        await req.app.locals.employeeCol.updateOne(
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
        await req.app.locals.employeeCol.updateOne(
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

exports.deleteSingleEmployee = catchAsync(async (req, res, next) => {
    /*
   1. Only Admin(SSC) can do this route.
   2. deletion means resigned,active,intern etc
   3. Remaining all cant access this route.
    */
    if (!req.params.id) {
        return next(
            new AppError('EMployee Id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'admin') {
        return next(
            new AppError(
                `Sorry! You don't have access to delete employee details`,
                401
            )
        );
    }
    let status = req.body.status;
    await req.app.locals.employeeCol.updateOne(
        {
            _id: new ObjectId(req.params.id)
        },
        { $set: { status: status } }
    );

    res.status(201).json({ message: `Employee updated with ${status}.` });
});
