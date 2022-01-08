const catchAsync = require('../../utilities/catchAsync');
const AppError = require('../../utilities/appError');
const Email = require('../../utilities/email');
const returnMillisec = require('../../utilities/returnMillisec');
var ObjectId = require('mongodb').ObjectID;
//const { ObjectID } = require('mongodb');
const vader = require('vader-sentiment');
var path = require('path');

exports.createStudentOutPass = catchAsync(async (req, res, next) => {
    if (res.locals.userObj.designation !== 'student') {
        return next(
            new AppError(
                `Sorry! You don't have access to request an outpass for a student`,
                400
            )
        );
    }
    req.body.createdDate = new Date();
    console.log('manvith0', req.body.outgoingDate);
    req.body.outgoingDate = new Date(
        new Date(req.body.outgoingDate).toISOString().split('T')[0]
    );
    console.log('manvith1', req.body.outgoingDate);
    let date1 = req.body.outgoingDate;
    date1.setDate(date1.getDate() + 1);
    console.log('date after adding one day', date1);

    console.log('manvith2', req.body.outgoingDate);
    req.body.incomingDate = new Date();
    req.body.status = 'pending';
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
        req.body.description
    );
    req.body.percentageOfEmergency = intensity.compound;
    req.body.statusUpdatedBy = undefined;
    req.body.belongsToStudent = res.locals.userObj.Id;
    req.body.belongsToStudentMongo = res.locals.userObj._id;
    //by Admin or Employee or Hod.
    req.body.statusUpdatedAt = undefined;
    req.body.statusUpdatedBy = undefined;
    //by student
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

    await req.app.locals.studentRequestCol.insertOne(req.body);

    res.status(200).json({
        message:
            'Request successfully created. Wait till your faculty approval.'
    });

    // Email Notification
    //to student
    try {
        const subject = `Request Created`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nWe have successfully received your out pass request. Please wait for approval from your HOD / Mentor.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
    //to employee
    let employeeId = res.locals.userObj.belongsToEmployee;
    let employeeObj = await req.app.locals.employeeCol.findOne({
        Id: employeeId
    });
    try {
        const subject = `Out pass Request`;
        const html = ``;
        const message = `Dear ${employeeObj.name},\n\nYour Mentee ${res.locals.userObj.name}-${res.locals.userObj.Id} has requested for an outpass and is waiting for your approval.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: employeeObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

//updateStudentRequstOutPass(student,security,employee,hod,(service center->optional))
exports.updateSingleStudentOutPass = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(
            new AppError('Student request id is mandatory in the params', 400)
        );
    }
    let requestMongoId = req.params.id;

    //admin,superadmin have no right to update the data
    if (res.locals.userObj.designation === 'superadmin') {
        return next(
            new AppError(
                "Sorry! You are not authorized to update student outpass",
                401
            )
        );
    }

    //get the studentRequestObj and associated student
    let studentRequestObj = await req.app.locals.studentRequestCol.findOne({
        _id: new ObjectId(requestMongoId)
    });

    if (!studentRequestObj) {
        return next(
            new AppError('There is no outpass which you want to update.', 404)
        );
    }
    let studentObj = await req.app.locals.studentCol.findOne({
        Id: studentRequestObj.belongsToStudent
    });

    if (!studentObj) {
        return next(
            new AppError(
                `There is no student with this roll id: ${studentRequestObj.belongsToStudent}`,
                404
            )
        );
    }
    if (res.locals.userObj.designation === 'security') {
        //check for status
        //(If okay):cross verify with student Id and otp and max time;

        minTime = studentRequestObj.outgoingDate.getTime();
        console.log('minTime', minTime);
        maxTime =
            returnMillisec(studentRequestObj.outgoingTime) +
            60 * 60 * 1000 +
            studentRequestObj.outgoingDate.getTime() +
            24 * 60 * 60 * 1000;
        console.log(maxTime);
        if (studentRequestObj.status !== 'accepted') {
            return next(
                new AppError(
                    `Student cannot go out since the requested outpass is ${studentRequestObj.status}`,
                    401
                )
            );
        } else if (studentRequestObj.isAuthenticated) {
            return next(
                new AppError(
                    `Student cannot go out since this request is already authenticated`,
                    401
                )
            );
        } else if (Date.now() < minTime) {
            return next(
                new AppError(`You cannot leave before the outgoing date`, 401)
            );
        } else if (Date.now() > maxTime) {
            return next(new AppError(`Invalid QR Code - Out of Time`, 401));
        }

        /* by shiva
            //we have to change this with removal of OTP in future and handle errors properly
        } else if (
            req.body.otp !== studentRequestObj.otp ||
            req.body.Id !== studentRequestObj.belongsToStudent
        ) {
            return next(new AppError('Invalid Qr-Code', 401)); //send error with some good msg
        } else if (Date.now() > maxTime) {
            return next(new AppError(`CANNOT GO OUT(out of time)`, 401));
        }
        */

        await req.app.locals.studentRequestCol.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    isAuthenticated: true,
                    authenticatedBy: res.locals.userObj.Id,
                    isAuthenticatedAt: new Date()
                }
            }
        );
        //608eb63f4b4d6b5730fb3262
        console.log('accepted by security');
        //Now it is accepted we have to send student data to security so that he verifies the photo

        res.status(200).json({ message: 'Success', studentObj: studentObj });
    } else if (
        res.locals.userObj.designation === 'employee' ||
        res.locals.userObj.designation === 'hod' ||
        res.locals.userObj.designation === 'admin'
    ) {
        // { status}

        //check whether employee or hod associated to student
        //if Associated : An employee can update till (one hour+outgoing time)
        //if update is possible ,then update it ,otherwise -->(mark it as unread)
        //otherwise return as error saying that you are not allowed to update the request out of time

        //set maxTime to half hour past outgoing timeout
        maxTime =
            returnMillisec(studentRequestObj.outgoingTime) +
            30 * 60 * 1000 +
            studentRequestObj.outgoingDate.getTime() +
            24 * 60 * 60 * 1000;

        console.log('date.now()', Date.now());
        console.log('maxTime', maxTime);
        console.log('cond', Date.now() > maxTime);

        if (
            res.locals.userObj.designation === 'employee' &&
            studentObj.belongsToEmployee !== res.locals.userObj.Id
        ) {
            return next(
                new AppError(
                    `You are not a mentor of this student ${studentObj.Id}`,
                    401
                )
            );
        } else if (
            res.locals.userObj.designation === 'hod' &&
            studentObj.belongsToHod !== res.locals.userObj.Id
        ) {
            return next(
                new AppError(
                    `You are not HOD of this student ${studentObj.Id}`,
                    401
                )
            );
        } else if (studentRequestObj.status !== 'pending') {
            return next(
                new AppError(
                    `You cannot accept/reject this request. This request is already ${studentRequestObj.status}`,
                    404
                )
            );
        } else if (Date.now() > maxTime) {
            return next(
                new AppError(
                    `You cannot accept/reject this request after deadline`,
                    401
                )
            );
        }
        if (req.body.status === 'rejected') {
            await req.app.locals.studentRequestCol.updateOne(
                { _id: new ObjectId(req.params.id) },
                {
                    $set: {
                        status: req.body.status,
                        statusUpdatedBy: res.locals.userObj.Id,
                        statusUpdatedAt: new Date()
                    }
                }
            );
            res.status(200).json({ message: 'successfully Rejected' });

            // Email Notification
            //to student
            try {
                const subject = `${studentObj.name},Your request has been rejected`;
                const html = ``;
                const message = `Dear ${studentObj.name},\n\nYour Request created at ${studentRequestObj.createdDate} has been rejected by ${res.locals.userObj.Id}.\n\nThanks & Regards,\nGATEZEE Team`;
                let user = { email: studentObj.email };
                await new Email(user).send(subject, html, message);
            } catch (err) {
                console.log('email delivery failed');
            }

            return;
        }

        // //generate otp
        // otp = generateOtp();
        // user.email = [studentObj.email, studentObj.parentEmail];
        // //send otp to student mailId
        // const subject = `ONE TIME PASSWORD FOR GOING OUT`;
        // html = `<p>We received that student ${studentObj.Id} wanted to got and it has been accepted. So use the following  otp for going out.Thank you!</p><br><h1>${otp}<h1>`;
        // await new Email(user).send(subject, html, message);
        await req.app.locals.studentRequestCol.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    status: 'accepted',
                    statusUpdatedBy: res.locals.userObj.Id,
                    statusUpdatedAt: new Date()
                }
            }
        );
        // res.status(200).json({ message: 'success', otp: otp });
        res.status(200).json({ message: 'successfully accepted' });

        // Email Notification
        //to student
        try {
            const subject = `Request Accepted`;
            const html = ``;
            const message = `Dear ${studentObj.name},\n\nYour Request created at ${studentRequestObj.createdDate} has been accepted by ${res.locals.userObj.Id}.\n\nGet the QR code from the app and you can go Out.\n\nThanks & Regards,\nGATEZEE Team`;
            let user = { email: studentObj.email };
            await new Email(user).send(subject, html, message);
        } catch (err) {
            console.log('email delivery failed');
        }
    }

    //student
    // 1.A student can edit his details as long as status of the request is pending
    else if (res.locals.userObj.designation === 'student') {
        if (studentRequestObj.belongsToStudent !== res.locals.userObj.Id) {
            return next(
                new AppError(
                    'You cannot edit this request as it is does not belong to you',
                    401
                )
            );
        }
        if (studentRequestObj.status !== 'pending') {
            return next(
                new AppError(
                    `You cannot edit this request as it as already ${studentRequestObj.status}`,
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
        const intensity =
            vader.SentimentIntensityAnalyzer.polarity_scores(description);

        let percentageOfEmergency = intensity.compound;

        if (req.files) {
            var fileName = req.files[0].filename;
            await req.app.locals.studentRequestCol.updateOne(
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
            await req.app.locals.studentRequestCol.updateOne(
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
    }
});

//deleteSingleStudentOutPass
exports.deleteSingleStudentOutPass = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(
            new AppError('Student request id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'student') {
        return next(
            new AppError(`You don't have rights to delete this outpass`, 401)
        );
    }
    //getstudentRequestObj
    let studentRequestObj = await req.app.locals.studentRequestCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!studentRequestObj) {
        return next(
            new AppError(
                'There is no request (outpass) with the id provided in the url',
                404
            )
        );
    }
    if (studentRequestObj.belongsToStudent !== res.locals.userObj.Id) {
        return next(
            new AppError(
                `You cannot delete this request as it is not associated to you`,
                401
            )
        );
    }
    if (studentRequestObj.status !== 'pending') {
        //only pending requests can be deleted
        return next(
            new AppError(
                `You cannot delete this outpass, as it is already ${studentRequestObj.status}`
            )
        );
    }

    await req.app.locals.studentRequestCol.updateOne(
        {
            _id: new ObjectId(req.params.id)
        },
        { $set: { status: 'deleted', detailsUpdatedAt: new Date() } }
    );

    res.status(200).json({ message: 'Your request is successfully deleted.' });

    // Email Notification
    //to student
    try {
        const subject = `Request Deleted!`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nYour request which is created at ${studentRequestObj.createdDate} has been successfully deleted.\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

//canceloutpass
exports.cancelSingleStudentOutPass = catchAsync(async (req, res, next) => {
    //A student can cancel his request till maxTime and status must be accepted
    if (!req.params.id) {
        return next(
            new AppError('Student request id is mandatory in the params', 400)
        );
    }
    if (res.locals.userObj.designation !== 'student') {
        return next(
            new AppError(
                `You don't have rights to cancel this outpass as it belongs to student`,
                401
            )
        );
    }
    let studentRequestObj = await req.app.locals.studentRequestCol.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!studentRequestObj) {
        return next(
            new AppError(
                'There is no request (outpass) with the associated id.',
                404
            )
        );
    }

    if (studentRequestObj.belongsToStudent !== res.locals.userObj.Id) {
        return next(
            new AppError(
                `You cannot cancel this request as it is not associated to you`,
                401
            )
        );
    }

    //only accepeted request can be cancelled
    if (studentRequestObj.status !== 'accepted') {
        return next(
            new AppError(
                `You cannot cancel this request as it not accepted. You can delete it.`,
                401
            )
        );
    }
    maxTime =
        returnMillisec(studentRequestObj.outgoingTime) +
        60 * 60 * 1000 +
        studentRequestObj.outgoingDate.getTime() +
        24 * 60 * 60 * 1000;
    //You can cancel the request within the given time frame
    if (Date.now() > maxTime) {
        return next(
            new AppError(`You cannot cancel this request as time is up`, 401)
        );
    }

    await req.app.locals.studentRequestCol.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: 'cancelled', detailsUpdatedAt: new Date() } }
    );

    res.status(200).json({
        message: 'Your request is successfully cancelled.'
    });

    // Email Notification
    //to student
    try {
        const subject = `Request Cancelled`;
        const html = ``;
        const message = `Dear ${res.locals.userObj.name},\n\nYour request which is created at ${studentRequestObj.createdDate} has been cancelled successfully .\n\nThanks & Regards,\nGATEZEE Team`;
        let user = { email: res.locals.userObj.email };
        await new Email(user).send(subject, html, message);
    } catch (err) {
        console.log('email delivery failed');
    }
});

exports.getAllStudentOutPasses = catchAsync(async (req, res, next) => {
    /*
    student : can access only self
    employee : can access only his mentees only
    hod : can access only his brach student only
    admin : can access any student
    superAdmin : can access any student
    security : can't access
     */
    if (!req.params.id) {
        return next(new AppError('Student id is mandatory in the params', 400));
    }

    //check security
    if (res.locals.userObj.designation === 'security') {
        return next(
            new AppError(
                'You are not authorized to view all OutPasses of a student',
                401
            )
        );
    }

    let mongoId = req.params.id;
    if (
        res.locals.userObj.designation === 'employee' ||
        res.locals.userObj.designation === 'hod'
    ) {
        let studentObj = await req.app.locals.studentCol.findOne({
            _id: new ObjectId(mongoId)
        });
        if (!studentObj) {
            return next(
                new AppError('Student not found associated with this id!', 404)
            );
        }

        if (
            res.locals.userObj.designation === 'employee' &&
            studentObj.belongsToEmployee !== res.locals.userObj.Id
        ) {
            return next(
                new AppError(
                    `You are not a mentor of the student ${studentObj.Id}`,
                    401
                )
            );
        }
        if (
            res.locals.userObj.designation === 'hod' &&
            studentObj.belongsToHod !== res.locals.userObj.Id
        ) {
            return next(
                new AppError(
                    `You are not HOD of the branch ${studentObj.department}`,
                    401
                )
            );
        }
    } else if (
        res.locals.userObj.designation === 'student' &&
        res.locals.userObj._id != mongoId
    ) {
        return next(
            new AppError(
                `You are not authorized to view other student data`,
                401
            )
        );
    }

    let allStudentRequests = await req.app.locals.studentRequestCol
        .find({ belongsToStudentMongo: new ObjectId(mongoId) })
        .toArray();
    res.status(200).json({
        message: 'success',
        allStudentOutPasses: allStudentRequests
    });
});

exports.getSingleStudentOutPass = catchAsync(async (req, res, next) => {
    /*
    student : can access only self
    employee : can access only his mentees only
    hod : can access only his brach student only
    admin : can access any student
    superAdmin : can access any student
    security : can't access
     */
    if (!req.params.id) {
        return next(
            new AppError('Student request id is mandatory in the params', 400)
        );
    }

    //check security
    if (res.locals.userObj.designation === 'security') {
        return next(
            new AppError(
                'You are not authorized to access out pass of the student',
                401
            )
        );
    }

    let requestMongoId = req.params.id;
    let requestObj = await req.app.locals.studentRequestCol.findOne({
        _id: new ObjectId(requestMongoId)
    });
    if (!requestObj) {
        return next(new AppError('Request Not Found!', 404));
    }
    let studentObj = await req.app.locals.studentCol.findOne({
        _id: requestObj.belongsToStudentMongo
    });
    if (!studentObj) {
        return next(
            new AppError('Student not found with the associated request!', 404)
        );
    }

    if (res.locals.userObj.designation === 'employee') {
        if (res.locals.userObj.Id !== studentObj.belongsToEmployee) {
            return next(
                new AppError(
                    `You are not a mentor of the student ${studentObj.Id}`,
                    401
                )
            );
        }
    }

    if (res.locals.userObj.designation === 'hod') {
        if (res.locals.userObj.Id !== studentObj.belongsToHod) {
            return next(
                new AppError(
                    `You are not HOD of the branch ${studentObj.department}`,
                    401
                )
            );
        }
    }
    //doubt is why (res.locals.userObj._id != studentObj.Id) is returning true.
    if (res.locals.userObj.designation === 'student') {
        if (res.locals.userObj.Id != studentObj.Id) {
            return next(
                new AppError(
                    `You are not authorized to view other student data`,
                    401
                )
            );
        }
    }

    res.status(200).json({ message: 'success', studentOutPass: requestObj });
});

exports.getAllStudentsAllOutPasses = catchAsync(async (req, res, next) => {
    /*
    This route is customized to get :
    
    employee : outpasses of all his mentees along with mentee Obj with each outpass
    hod : outpasses of all his branch students along with student Obj with each outpass
    admin : outpasses of all the students in college along with student Obj with each outpass
    security : cant access this route
    */
    //check security
    if (
        res.locals.userObj.designation === 'security' ||
        res.locals.userObj.designation === 'student'
    ) {
        return next(
            new AppError(
                'You are not authorized to access out passes of all students',
                401
            )
        );
    }

    if (res.locals.userObj.designation === 'employee') {
        let allStudentsAllOutPasses = [];

        // 1. Get all Students of this employee
        let allStudentsObj = await req.app.locals.studentCol
            .find({ belongsToEmployee: res.locals.userObj.Id })
            .toArray();
        // 2. Loop over all students and add outpasses of each student in a variable;
        for (var student of allStudentsObj) {
            let studentOutPasses = await req.app.locals.studentRequestCol
                .find({
                    belongsToStudent: student.Id
                })
                .toArray();

            //attach student to each studentOutPasses
            for (var studentOutPass of studentOutPasses) {
                studentOutPass.studentObj = student;
            }

            allStudentsAllOutPasses =
                allStudentsAllOutPasses.concat(studentOutPasses);
        }
        // 3. Do some Sorting

        // 4. Send response

        return res.status(200).json({
            message: 'success',
            allStudentsAllOutPasses: allStudentsAllOutPasses
        });
    }

    if (res.locals.userObj.designation === 'hod') {
        let allStudentsAllOutPasses = [];
        // 1. Get all Students of this hod
        let allStudentsObj = await req.app.locals.studentCol
            .find({ belongsToHod: res.locals.userObj.Id })
            .toArray();
        // 2. Loop over all students and add outpasses of each student in a variable;
        for (var student of allStudentsObj) {
            let studentOutPasses = await req.app.locals.studentRequestCol
                .find({
                    belongsToStudent: student.Id
                })
                .toArray();

            //attach student to each studentOutPasses
            for (var studentOutPass of studentOutPasses) {
                studentOutPass.studentObj = student;
            }
            allStudentsAllOutPasses =
                allStudentsAllOutPasses.concat(studentOutPasses);
        }
        // 3. Do some Sorting

        // 4. Send response
        return res.status(200).json({
            message: 'success',
            allStudentsAllOutPasses: allStudentsAllOutPasses
        });
    }

    //admin
    var allStudentsAllOutPasses = [];
    // 1. Get all Students from college
    let allStudentsObj = await req.app.locals.studentCol.find().toArray();
    // 2. Loop over all students and add outpasses of each student in a variable;
    for (var student of allStudentsObj) {
        let studentOutPasses = await req.app.locals.studentRequestCol
            .find({
                belongsToStudent: student.Id
            })
            .toArray();

        //attach student to each studentOutPasses
        for (var studentOutPass of studentOutPasses) {
            studentOutPass.studentObj = student;
        }

        allStudentsAllOutPasses =
            allStudentsAllOutPasses.concat(studentOutPasses);
    }
    // 3. Do some Sorting
    // 4. Send response
    return res.status(200).json({
        message: 'success',
        allStudentsAllOutPasses: allStudentsAllOutPasses
    });
});
