const catchAsync = require('../../utilities/catchAsync');
const AppError = require('../../utilities/appError');
const Email = require('../../utilities/email');
const returnMillisec = require('../../utilities/returnMillisec');
//const { ObjectID } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const vader = require('vader-sentiment');

exports.createEmployeeOutPass = catchAsync(async (req, res, next) => {
    if (res.locals.userObj.designation !== 'employee') {
        return next(
            new AppError(
                `Sorry! You don't have access to request an outpass for an employee`,
                400
            )
        );
    }
    req.body.createdDate = new Date();
    req.body.outgoingDate = new Date(
        new Date(req.body.outgoingDate).toISOString().split('T')[0]
    );
    let date1 = req.body.outgoingDate;
    date1.setDate(date1.getDate() + 1);

    // req.body.outgoingDate = new Date(req.body.outgoingDate)
    //     .toISOString()
    //     .split('T')[0];
    req.body.incomingDate = new Date();
    req.body.status = 'pending';
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
        req.body.description
    );
    req.body.percentageOfEmergency = intensity.compound;
    req.body.statusUpdatedBy = undefined;
    req.body.belongsToEmployee = res.locals.userObj.Id;
    req.body.belongsToEmployeeMongo = res.locals.userObj._id;
    //by Admin or Hod.
    req.body.statusUpdatedAt = undefined;
    req.body.statusUpdatedBy = undefined;
    //by employee
    req.body.detailsUpdatedAt = undefined;
    //by security
    req.body.isAuthenticated = false;
    req.body.authenticatedBy = undefined;
    req.body.isAuthenticatedAt = undefined;
    //otp and file name if there
    if (req.files) {
        req.body.fileName = req.files[0].filename;
    } else {
        req.body.fileName = undefined;
    }

    await req.app.locals.employeeRequestCol.insertOne(req.body);
    res.status(200).json({
        message:
            'Successfully created request for You.Wait till someone Approves it.'
    });

    // Email Notification
    //to employee
    try {
        const subject = `Request Created`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nWe have successfully received your out pass request. Please wait for the approval from your HOD.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
    //to hod
    let hodId = res.locals.userObj.belongsToHod;
    let hodObj = await req.app.locals.hodCol.findOne({
        Id: hodId
    });
    try {
        const subject = `Out pass Requested`;
        const html = ``;
        const message = `Dear ${hodObj.name},\n\nYour Employee, ${res.locals.userObj.name}-${res.locals.userObj.Id} has requested for an out pass and is waiting for your approval.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: hodObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

exports.updateSingleEmployeeOutPass = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(
            new AppError('Employee Request Id is mandatory in the params', 400)
        );
    }
    //admin,superadmin,student have  no right to update the data
    if (
        res.locals.userObj.designation === 'superadmin' ||
        res.locals.userObj.designation === 'admin' ||
        res.locals.userObj.designation === 'student'
    ) {
        return next(
            new AppError(
                "You're not authorized to update employee out pass",
                401
            )
        );
    }
    let requestMongoId = req.params.id;
    let employeeRequestObj = await req.app.locals.employeeRequestCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!employeeRequestObj) {
        return next(
            new AppError(
                'There is no request (outpass) with this id associated',
                404
            )
        );
    }
    let employeeObj = await req.app.locals.employeeCol.findOne({
        Id: employeeRequestObj.belongsToEmployee
    });
    if (!employeeObj) {
        return next(
            new AppError(
                `There is no employee with this id:${employeeRequestObj.belongsToEmployee}`,
                404
            )
        );
    }
    //who can access this route->{security,employee, associated hod}
    if (res.locals.userObj.designation === 'security') {
        minTime = employeeRequestObj.outgoingDate.getTime();

        maxTime =
            returnMillisec(employeeRequestObj.outgoingTime) +
            60 * 60 * 1000 +
            employeeRequestObj.outgoingDate.getTime() +
            24 * 60 * 60 * 1000;
        console.log(maxTime);
        if (employeeRequestObj.status !== 'accepted') {
            return next(
                new AppError(
                    `Employee cannot go out since request outpass is ${employeeRequestObj.status}`,
                    401
                )
            );
        } else if (employeeRequestObj.isAuthenticated) {
            return next(
                new AppError(
                    `Employee cannot go out since this request is already authenticated`,
                    401
                )
            );
            //we have to change this with removal of OTP in future and handle errors properly
        } else if (Date.now() < minTime) {
            return next(
                new AppError(`You cannot go out before the outgoing date`, 401)
            );
        } else if (Date.now() > maxTime) {
            return next(new AppError(`Invalid QR Code - Out of Time`, 401));
        }

        await req.app.locals.employeeRequestCol.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    isAuthenticated: true,
                    authenticatedBy: res.locals.userObj.Id,
                    isAuthenticatedAt: new Date()
                }
            }
        );
        console.log('accepted by security');
        //send employeeObj for photo reference by the security
        return res
            .status(200)
            .json({ message: 'success', employeeObj: employeeObj });
    } else if (res.locals.userObj.designation === 'employee') {
        //he might want to update some things
        if (employeeRequestObj.belongsToEmployee !== res.locals.userObj.Id) {
            return next(
                new AppError(
                    'You cannot edit this request as it is does not belong to you',
                    401
                )
            );
        }
        if (employeeRequestObj.status !== 'pending') {
            return next(
                new AppError(
                    `you cannot edit this request as it as already ${employeeRequestObj.status}`,
                    400
                )
            );
        }

        /*update relevant details
         */

        let outgoingDate = new Date(
            new Date(req.body.outgoingDate).toISOString().split('T')[0]
        );
        let outgoingTime = req.body.outgoingTime;
        let incomingDate = new Date();
        let reason = req.body.reason;
        let description = req.body.description;
        //calculate again here POE
        let percentageOfEmergency = 80;

        if (req.files) {
            var fileName = req.files[0].filename;
            await req.app.locals.employeeRequestCol.updateOne(
                { Id: res.locals.userObj.Id },
                {
                    $set: {
                        outgoingDate: outgoingDate,
                        outgoingTime: outgoingTime,
                        incomingDate: incomingDate,
                        reason: reason,
                        description: description,
                        percentageOfEmergency: percentageOfEmergency,
                        fileName: fileName,
                        detailsUpdatedAt: new Date()
                    }
                }
            );
        } else {
            await req.app.locals.employeeRequestCol.updateOne(
                { Id: res.locals.userObj.Id },
                {
                    $set: {
                        outgoingDate: outgoingDate,
                        outgoingTime: outgoingTime,
                        incomingDate: incomingDate,
                        reason: reason,
                        description: description,
                        percentageOfEmergency: percentageOfEmergency,
                        detailsUpdatedAt: new Date()
                    }
                }
            );
        }

        res.status(200).json({ message: 'successfully updated' });
    } else if (res.locals.userObj.designation === 'hod') {
        //console.log('employee req obj :', employeeRequestObj);
        maxTime =
            returnMillisec(employeeRequestObj.outgoingTime) +
            30 * 60 * 1000 +
            employeeRequestObj.outgoingDate.getTime() +
            24 * 60 * 60 * 1000;
        if (res.locals.userObj.Id !== employeeObj.belongsToHod) {
            return next(
                new AppError(
                    `You're not an hod of the  employee ${employeeObj.Id}`,
                    400
                )
            );
        } else if (employeeRequestObj.status !== 'pending') {
            return next(
                new AppError(
                    `This request is already ${employeeRequestObj.status}!`,
                    404
                )
            );
        } else if (Date.now() > maxTime) {
            return next(
                new AppError(`You cannot edit this request after deadline`, 401)
            );
        }
        if (req.body.status === 'rejected') {
            await req.app.locals.employeeRequestCol.updateOne(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: {
                        status: req.body.status,
                        statusUpdatedBy: res.locals.userObj.Id,
                        statusUpdatedAt: new Date()
                    }
                }
            );
            res.status(200).json({ message: 'successfully rejected' });

            // Email Notification
            //to employee
            try {
                const subject = `Request Rejected`;
                const html = ``;
                const message = `Dear ${employeeObj.name},\n\nYour Request created at ${employeeRequestObj.createdDate} has been rejected by ${res.locals.userObj.Id}.\n\nThanks & Regards,\nGATEZEE Team`;
                let user = { email: employeeObj.email };
                await new Email(user).send(subject, html, message);
            } catch (err) {
                console.log('email delivery failed');
            }

            return;
        }

        // //generate otp
        // otp = generateOtp();
        // user.email = [employeeObj.email, employeeObj.parentEmail];
        // //send otp to student mailId
        // const subject = `ONE TIME PASSWORD FOR GOING OUT`;
        // html = `<p>We received that employee ${employeeObj.Id} wanted to go out and it has been accepted. So use the following  otp for going out.Thank you!</p><br><h1>${otp}<h1>`;
        // await new Email(user).send(subject, html, message);

        await req.app.locals.employeeRequestCol.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    status: 'accepted',
                    statusUpdatedBy: res.locals.userObj.Id,
                    statusUpdatedAt: new Date()
                }
            }
        );
        res.status(200).json({ message: 'successfully accepted' });

        // Email Notification
        //to employee
        try {
            const subject = `Request Accepted`;
            const html = ``;
            const message = `Dear ${employeeObj.name},\n\nYour Request created at ${employeeRequestObj.createdDate} has been accepted by ${res.locals.userObj.Id}.\n\n Get the QR code from the app.\n\nThanks & Regards,\nGATEZEE Team`;
            let user = { email: employeeObj.email };
            await new Email(user).send(subject, html, message);
        } catch (err) {
            console.log('email delivery failed');
        }
    } else {
        return next(
            new AppError(`You cannot perform that operation, please contact admin`, 401)
        );
    }
});

exports.getSingleEmployeeOutPass = catchAsync(async (req, res, next) => {
    /*
    employee : can access only self
    hod : can access only his brach employee only
    superAdmin : can access any employee
    security : can't access
     */
    if (!req.params.id) {
        return next(
            new AppError('Employee request id is mandatory in the params', 400)
        );
    }

    //check security
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student' ||
        res.locals.userObj.designation === 'admin'
    ) {
        return next(
            new AppError(
                'You are not authorized to access out pass of an employee',
                401
            )
        );
    }

    let requestMongoId = req.params.id;
    let requestObj = await req.app.locals.employeeRequestCol.findOne({
        _id: new ObjectId(requestMongoId)
    });

    if (!requestObj) {
        return next(new AppError('Request Not Found!', 404));
    }
    let employeeObj = await req.app.locals.employeeCol.findOne({
        _id: requestObj.belongsToEmployeeMongo
    });

    if (!employeeObj) {
        return next(
            new AppError(
                'Employee not found associated with this request!',
                404
            )
        );
    }

    if (res.locals.userObj.designation === 'hod') {
        if (res.locals.userObj.Id !== employeeObj.belongsToHod) {
            return next(
                new AppError(
                    `You're not HOD of the employee ${employeeObj.Id}`,
                    401
                )
            );
        }
    }

    if (res.locals.userObj.designation === 'employee') {
        if (res.locals.userObj.Id != employeeObj.Id) {
            return next(
                new AppError(
                    `You're not authorized to view others employee data`,
                    401
                )
            );
        }
    }

    res.status(200).json({ message: 'success', employeeOutPass: requestObj });
});

exports.getAllEmployeeOutPasses = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(
            new AppError('Employee Id is mandatory in the params', 400)
        );
    }

    //check security and student
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student'
    ) {
        return next(
            new AppError(
                'You are not authorized to view all out passes of an employee',
                401
            )
        );
    }

    let mongoId = req.params.id;
    if (
        res.locals.userObj.designation === 'employee' ||
        res.locals.userObj.designation === 'hod'
    ) {
        let employeeObj = await req.app.locals.employeeCol.findOne({
            _id: new ObjectId(mongoId)
        });
        if (!employeeObj) {
            return next(
                new AppError('Employee not found associated with this Id!', 404)
            );
        }

        if (
            res.locals.userObj.designation === 'hod' &&
            employeeObj.belongsToHod !== res.locals.userObj.Id
        ) {
            return next(
                new AppError(
                    `You're not HOD of the branch ${employeeObj.department}`,
                    401
                )
            );
        }
    } else if (
        res.locals.userObj.designation === 'employee' &&
        res.locals.userObj._id != mongoId
    ) {
        return next(
            new AppError(
                `You're not authorized to view others employee data`,
                401
            )
        );
    }

    let allEmployeeRequests = await req.app.locals.employeeRequestCol
        .find({ belongsToEmployeeMongo: new ObjectId(mongoId) })
        .toArray();
    res.status(200).json({
        message: 'success',
        allEmployeeOutPasses: allEmployeeRequests
    });
});

exports.deleteSingleEmployeeOutPass = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(
            new AppError('Employee request id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'employee') {
        return next(
            new AppError(`You don't have right to delete this outpass`, 401)
        );
    }
    //getstudentRequestObj
    let employeeRequestObj = await req.app.locals.employeeRequestCol.findOne({
        _id: new ObjectId(req.params.id)
    });
    if (!employeeRequestObj) {
        return next(
            new AppError(
                'There is no request (outpass) with this id',
                404
            )
        );
    }
    if (employeeRequestObj.belongsToEmployee !== res.locals.userObj.Id) {
        return next(
            new AppError(
                `You cannot delete this request as it is not associated to you!`,
                401
            )
        );
    }
    if (employeeRequestObj.status !== 'pending') {
        //only pending requests can be deleted
        return next(
            new AppError(
                `You cannot delete this outpass, as it is already ${employeeRequestObj.status}`
            )
        );
    }

    await req.app.locals.employeeRequestCol.updateOne(
        {
            _id: new ObjectID(req.params.id)
        },
        { $set: { status: 'deleted', detailsUpdatedAt: new Date() } }
    );

    res.status(200).json({ message: 'Your request is successfully deleted.' });

    // Email Notification
    //to employee
    try {
        const subject = `Request Deleted`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nYour request which is created at ${employeeRequestObj.createdDate} has been deleted successfully.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

exports.cancelSingleEmployeeOutPass = catchAsync(async (req, res, next) => {
    //An Employee can cancel his request till maxTime and status must be accepted
    if (!req.params.id) {
        return next(
            new AppError('Employee Request Id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'employee') {
        return next(
            new AppError(
                `You don't have right to cancel this outpass as it belongs to a employee`,
                401
            )
        );
    }
    let employeeRequestObj = await req.app.locals.employeeRequestCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!employeeRequestObj) {
        return next(
            new AppError(
                'There is no request (outpass) with this id associated.',
                404
            )
        );
    }

    if (employeeRequestObj.belongsToEmployee !== res.locals.userObj.Id) {
        return next(
            new AppError(
                `You cannot cancel this request as it is not associated to you!`,
                401
            )
        );
    }

    //only accepeted request can be cancelled
    if (employeeRequestObj.status !== 'accepted') {
        return next(
            new AppError(
                `You cannot cancel this request as it not accepted. You can delete it.`,
                401
            )
        );
    }
    maxTime =
        returnMillisec(employeeRequestObj.outgoingTime) +
        60 * 60 * 1000 +
        employeeRequestObj.outgoingDate.getTime() +
        24 * 60 * 60 * 1000;
    //You can cancel the request within the given time frame
    if (Date.now() > maxTime) {
        return next(
            new AppError(`You cannot cancel this request as time is up`, 401)
        );
    }

    await req.app.locals.employeeRequestCol.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: 'cancelled', detailsUpdatedAt: new Date() } }
    );

    res.status(200).json({
        message: 'Your request is cancelled successfully .'
    });

    // Email Notification
    //to employee
    try {
        const subject = `Request Cancelled`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nYour request created at ${employeeRequestObj.createdDate} has been cancelled successfully .\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

exports.getAllEmployeesAllOutPasses = catchAsync(async (req, res, next) => {
    /*
    This route is customized to get :
    
    hod : outpasses of all his branch employees
    admin : outpasses of all the employees in college
    security : cant access this route
    */

    //check security
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'employee' ||
        res.locals.userObj.designation === 'student'
    ) {
        return next(
            new AppError(
                'You are not authorized to access out passes of all employees',
                401
            )
        );
    }

    if (res.locals.userObj.designation === 'hod') {
        let allEmployeesAllOutPasses = [];
        // 1. Get all Employees of this hod
        let allEmployeesObj = await req.app.locals.employeeCol
            .find({ belongsToHod: res.locals.userObj.Id })
            .toArray();
        // 2. Loop over all employees and add outpasses of each employee in a variable;
        for (var employee of allEmployeesObj) {
            let employeeOutPasses = await req.app.locals.employeeRequestCol
                .find({
                    belongsToEmployee: employee.Id
                })
                .toArray();

            //attach student to each studentOutPasses
            for (var employeeOutPass of employeeOutPasses) {
                employeeOutPass.employeeObj = employee;
            }

            allEmployeesAllOutPasses =
                allEmployeesAllOutPasses.concat(employeeOutPasses);
        }
        // 3. Do some Sorting
        // 4. Send response
        return res.status(200).json({
            message: 'success',
            allEmployeesAllOutPasses: allEmployeesAllOutPasses
        });
    }

    //admin
    var allEmployeesAllOutPasses = [];
    // 1. Get all Employees from college
    let allEmployeesObj = await req.app.locals.employeeCol.find().toArray();
    // 2. Loop over all employees and add outpasses of each employee in a variable;
    for (var employee of allEmployeesObj) {
        let employeeOutPasses = await req.app.locals.employeeRequestCol
            .find({
                belongsToEmployee: employee.Id
            })
            .toArray();

        //attach student to each studentOutPasses
        for (var employeeOutPass of employeeOutPasses) {
            employeeOutPass.employeeObj = employee;
        }

        allEmployeesAllOutPasses =
            allEmployeesAllOutPasses.concat(employeeOutPasses);
    }
    // 3. Do some Sorting
    // 4. Send response
    return res.status(200).json({
        message: 'success',
        allEmployeesAllOutPasses: allEmployeesAllOutPasses
    });
});
