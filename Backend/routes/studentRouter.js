const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const studentController = require('./../controllers/studentcontroller');
//utilities
const uploadUserPhoto = require('./../utilities/ImageUpload').uploadUserPhoto;
const resizeUserPhoto = require('./../utilities/ImageUpload').resizeUserPhoto;
//validators

//routes
router.use(authController.verification);

router
    .route('/')
    .get(studentController.getAllStudents)
    .post(studentController.createNewStudent);

router
    .route('/:id')
    .get(studentController.getSingleStudent)
    .patch(
        uploadUserPhoto,
        resizeUserPhoto,
        studentController.updateSingleStudent
    )
    .delete(studentController.deleteSingleStudent);

module.exports = router;
