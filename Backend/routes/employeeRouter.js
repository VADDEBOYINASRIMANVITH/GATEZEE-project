const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const employeeController = require('./../controllers/employeeController');
//utilities
const uploadUserPhoto = require('./../utilities/ImageUpload').uploadUserPhoto;
const resizeUserPhoto = require('./../utilities/ImageUpload').resizeUserPhoto;
//validators

//routes
router.use(authController.verification);

router
    .route('/')
    .get(employeeController.getAllEmployees)
    .post(employeeController.createNewEmployee);

router
    .route('/:id')
    .get(employeeController.getSingleEmployee)
    .patch(
        uploadUserPhoto,
        resizeUserPhoto,
        employeeController.updateSingleEmployee
    )
    .delete(employeeController.deleteSingleEmployee);

module.exports = router;
