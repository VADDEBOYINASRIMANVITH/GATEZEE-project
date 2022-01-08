const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const adminController = require('./../controllers/adminController');
//utilities

//validators

//routes
router.use(authController.verification);

router
    .route('/')
    .get(adminController.getAllAdmins)
    .post(adminController.createNewAdmin);

router
    .route('/:id')
    .get(adminController.getSingleAdmin)
    .patch(adminController.updateSingleAdmin)
    .delete(adminController.deleteSingleAdmin);

module.exports = router;
