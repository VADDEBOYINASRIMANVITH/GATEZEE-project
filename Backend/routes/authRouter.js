const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');

/*  validators

const resetPasswordValidator = require('./../validators/resetPasswordValidator')
    .validate;
const loginValidator = require('./../validators/loginValidator').validate;
const forgotPasswordValidator = require('./../validators/forgotPasswordValidator')
    .validate;
const changePasswordValidator = require('./../validators/changePasswordValidator')
    .validate;
*/

//routes
router.route('/login').post(authController.login);
router
    .route('/changepassword')
    .post(authController.verification, authController.changePassword);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);
router
    .route('/getuserbasedontoken/:token')
    .get(authController.getUserBasedOnToken);
module.exports = router;
