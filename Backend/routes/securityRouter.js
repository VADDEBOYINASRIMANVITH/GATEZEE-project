const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const securityController = require('./../controllers/securityController');
//utilities

//validators

//routes
router.use(authController.verification);

router
    .route('/')
    .get(securityController.getAllSecuritys)
    .post(securityController.createNewSecurity);

router
    .route('/:id')
    .get(securityController.getSingleSecurity)
    .patch(securityController.updateSingleSecurity)
    .delete(securityController.deleteSingleSecurity);

module.exports = router;
