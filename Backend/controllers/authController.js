const AppError = require('../utilities/appError');
const jwt = require('jsonwebtoken');
const getCollection = require('../utilities/getCollection').getCollection;
var ObjectId = require('mongodb').ObjectId;
const catchAsync = require('../utilities/catchAsync');
const bcrypt = require('bcryptjs');
const generateRandomToken =
    require('../utilities/generateRandomToken').generateRandomToken;
const getCollectionByField =
    require('../utilities/getCollectionByField').getCollectionByField;

const { validationResult } = require('express-validator');
const Email = require('./../utilities/email');
const crypto = require('crypto');

const USER_COLLECTIONS = [
    { designation: 'student', collection: 'studentCol' },
    { designation: 'employee', collection: 'employeeCol' },
    { designation: 'hod', collection: 'hodCol' },
    { designation: 'admin', collection: 'adminCol' },
    { designation: 'superadmin', collection: 'superAdminCol' },
    { designation: 'security', collection: 'securityCol' }
];

exports.verification = async (req, res, next) => {
    try {
        if (req.headers.authorization == undefined) {
            return next(
                new AppError('You are not logged In. Please Login.', 401)
            );
        }
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(
                new AppError('You are not logged In. Please Login.', 401)
            );
        }

        tokenparts = token.split('.');

        let part1 = tokenparts[0];
        let part3 = tokenparts[2];
        let part2 = tokenparts[1].substring(41);

        const origToken = part1 + '.' + part2 + '.' + part3;

        const payload = await jwt.verify(origToken, process.env.TOKEN_KEY);

        if (!payload) {
            return next(new AppError('Unauthorized Access.', 401));
        }
        //1. get payload
        //user_id: userObj._id,
        //user_designation:userObj.designation

        let user_id = payload.user_id;
        let role = payload.user_designation;
        let obj = getCollection(role, req.app.locals);
        let coll = obj.coll;
        try {
            //1. user there or not exist
            let userObj = await coll.findOne({
                _id: new ObjectId(user_id)
            });
            if (userObj == null || userObj == undefined) {
                return next(
                    new AppError(
                        'You are not a valid User.Please signup to continue',
                        404
                    )
                );
            }
            //2. check lastPasswordChange<=lastGeneratedToken
            if (
                userObj.lastPasswordChangedAt.getTime() >
                userObj.lastTokenGeneratedAt.getTime()
            ) {
                return next(
                    new AppError(
                        'You have recently changed your password.Please Login Again.',
                        401
                    )
                );
            }

            res.locals.userObj = userObj;
            req.userId = userObj.Id;
        } catch (err) {
            console.log(err);
            return next(new AppError('Internal Server Error', 500));
        }
        next();
    } catch (err) {
        console.log(err);
        if (err.name == 'TokenExpiredError')
            return next(
                new AppError('Session Expired. Please Login Again', 401)
            );
        return next(new AppError('Internal Server Error', 500));
    }
};

exports.getUserBasedOnToken = async (req, res, next) => {
    try {
        let token = req.params.token;
        if (!token) {
            return next(
                new AppError('You are not logged In. Please Login.', 401)
            );
        }

        tokenparts = token.split('.');

        let part1 = tokenparts[0];
        let part3 = tokenparts[2];
        let part2 = tokenparts[1].substring(41);

        const origToken = part1 + '.' + part2 + '.' + part3;

        const payload = await jwt.verify(origToken, process.env.TOKEN_KEY);

        if (!payload) {
            return next(new AppError('Unauthorized Access.', 401));
        }
        //1. get payload
        //user_id: userObj._id,
        //user_designation:userObj.designation

        let user_id = payload.user_id;
        let role = payload.user_designation;
        let obj = getCollection(role, req.app.locals);
        let coll = obj.coll;
        try {
            //1. user there or not exist
            let userObj = await coll.findOne({
                _id: new ObjectId(user_id)
            });
            if (userObj == null || userObj == undefined) {
                return next(
                    new AppError(
                        'You are not a valid User.Please signup to continue',
                        404
                    )
                );
            }
            //2. check lastPasswordChange<=lastGeneratedToken
            if (
                userObj.lastPasswordChangedAt.getTime() >
                userObj.lastTokenGeneratedAt.getTime()
            ) {
                return next(
                    new AppError(
                        'You have recently changed your password.Please Login Again.',
                        401
                    )
                );
            }

            res.locals.userObj = userObj;
            req.userId = userObj.Id;

            res.status(200).json({ message: 'success', userObj: userObj });
        } catch (err) {
            console.log(err);
            return next(new AppError('Internal Server Error', 500));
        }
    } catch (err) {
        console.log(err);
        if (err.name == 'TokenExpiredError')
            return next(
                new AppError('Session Expired. Please Login Again', 401)
            );
        return next(new AppError('Internal Server Error', 500));
    }
};

exports.login = catchAsync(async (req, res, next) => {
    if (!req.body) {
        return next(new AppError('Data is mandatory in the request body', 400));
    }

    let obj = await getCollectionByField(
        'Id',
        req.body.Id,
        USER_COLLECTIONS,
        req.app.locals
    );
    if (obj == undefined)
        return next(new AppError('You are not registered.', 404));

    let coll = req.app.locals[obj.collection];
    let userObj = obj.collectionObj;

    let bcryptResult = await bcrypt.compare(
        req.body.password,
        userObj.password
    );
    if (bcryptResult) {
        let token = jwt.sign(
            {
                user_id: userObj._id,
                user_designation: userObj.designation
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: '1hr'
            }
        );

        //save to database
        await coll.updateOne(
            {
                Id: req.body.Id
            },
            {
                $set: {
                    lastTokenGeneratedAt: new Date()
                }
            }
        );

        //modifytoken
        let tokenparts = token.split('.');
        let modiftoken =
            tokenparts[0] +
            '.' +
            'brA4BeyQRlsTv0f24peeyJ7Gb9PnPSeysx6Z95OqO' +
            tokenparts[1] +
            '.' +
            tokenparts[2];

        res.status(201).json({
            message: 'success',
            designation: userObj.designation,
            signedToken: modiftoken
        });
    } else {
        return next(new AppError('Invalid Password!', 401));
    }
});

exports.changePassword = catchAsync(async (req, res, next) => {
    if (!req.body) {
        return next(new AppError('Data is mandatory in the request body', 400));
    }

    let coll = getCollection(
        res.locals.userObj.designation,
        req.app.locals
    ).coll;

    if (
        !(await bcrypt.compare(
            req.body.oldPassword,
            res.locals.userObj.password
        ))
    ) {
        return next(new AppError('Your current password is incorrect.', 401));
    }
    let salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    let hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    await coll.updateOne(
        { _id: new ObjectId(res.locals.userObj._id) },
        {
            $set: {
                password: hashedPassword,
                lastPasswordChangedAt: new Date()
            }
        }
    );
    res.status(200).json({
        message: 'Password has been updated successfully'
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //send post request with {Id}

    const getCollectionByField =
        await require('../utilities/getCollectionByField').getCollectionByField(
            'Id',
            req.body.Id,
            USER_COLLECTIONS,
            req.app.locals
        );

    if (getCollectionByField == undefined) {
        return next(
            new AppError(`There is no user with this Id ${req.body.Id}`, 404)
        );
    }
    const user = getCollectionByField.collectionObj;
    coll = req.app.locals[getCollectionByField.collection]; //studentCol

    const tokenObj = generateRandomToken();
    try {
        const subject = 'Your Password Reset link is valid only for 10 mins!';
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/v1/resetPassword/${tokenObj.token}`;
        //dummy resetUrl1 for execution on localhost
        const resetUrl1 = `http://localhost:4200/v1/resetpassword/${tokenObj.token}`;
        const html = `<a href="${resetUrl1}"  target="_blank" ><button>Reset Password</button></a>`;
        const message = `Dear User, Please click on the button to reset your password. It is valid only for 10 mins.Thank you.`;
        await new Email(user).send(subject, html, message);
    } catch (err) {
        return next(
            new AppError(
                `There is an error in sending Email,Please try again after some time`,
                500
            )
        );
    }

    await coll.updateOne(
        { Id: req.body.Id },
        {
            $set: {
                passwordResetToken: tokenObj.passwordResetToken,
                resetPasswordExpiresAt: Date.now() + 10 * 60 * 1000
            }
        }
    );
    return res.status(200).json({
        message:
            'An Email has been sent to your emailId, Follow the instructions given in the Email!'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //{password(new)}

    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ errors: errors.array() });
    // }

    const passwordResetToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    //
    const collection_object = await getCollectionByField(
        'passwordResetToken',
        passwordResetToken,
        USER_COLLECTIONS,
        req.app.locals
    );

    if (collection_object == undefined) {
        return next(new AppError(`Invalid Reset Password Link.`, 404));
    }
    const coll = req.app.locals[collection_object.collection];
    //

    // const coll = getCollection(req.body.designation, req.app.locals).coll;

    const user = await coll.findOne({
        passwordResetToken: passwordResetToken,
        resetPasswordExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
        return next(
            new AppError('Reset Password Link is expired.Generate again.', 400)
        );
    }

    let salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    await coll.updateOne(
        { passwordResetToken: passwordResetToken },
        {
            $set: {
                password: hashedPassword,
                lastPasswordChangedAt: new Date(),
                passwordResetToken: undefined,
                resetPasswordExpiresAt: undefined
            }
        }
    );
    res.status(201).json({
        message: 'Your new password is successfully updated.Please login!'
    });
});
