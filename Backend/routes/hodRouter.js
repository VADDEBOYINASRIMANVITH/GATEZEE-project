const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const hodController = require('./../controllers/hodController');
//utilities
const uploadUserPhoto = require('./../utilities/ImageUpload').uploadUserPhoto;
const resizeUserPhoto = require('./../utilities/ImageUpload').resizeUserPhoto;
//validators

//routes
router.use(authController.verification);

router
    .route('/')
    .get(hodController.getAllHods)
    .post(hodController.createNewHod);

router
    .route('/:id')
    .get(hodController.getSingleHod)
    .patch(uploadUserPhoto, resizeUserPhoto, hodController.updateSingleHod)
    .delete(hodController.deleteSingleHod);

module.exports = router;
