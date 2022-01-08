const { check, validationResult } = require('express-validator');

exports.validate = [
    check('password')
        .exists()
        .withMessage('password field is required')
        .isLength({ min: 8 })
        .withMessage('password must be atleast 8 chars long')
        .matches(/\d/)
        .withMessage('password must be contain atleast one digit')
        .matches(/(.*[a-z])/)
        .withMessage('password must be contain atleast one lower case')
        .matches(/(.*[A-Z])/)
        .withMessage('password must be contain atleast one upper case')
        .matches(/(.*[&%$@!#*])/)
        .withMessage(
            'password must be contain atleast one special character(*,&,%,$,!,)'
        ),
    check('confirmPassword')
        .exists()
        .withMessage('confirm Password field is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirma does not match password');
            }
            return true;
        }),
    function (req, res, next) {
        const error = validationResult(req);
        if (error.isEmpty()) {
            return next();
        }
        const extractedErrors = [];
        error
            .array()
            .map((err) => extractedErrors.push({ [err.param]: err.msg }));
        return res.status(422).json({
            errors: extractedErrors
        });
    }
];
