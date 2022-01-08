const exp = require('express');
const router = exp.Router();

//controllers
const authController = require('./../controllers/authController');
const studentOutPassController = require('./../controllers/outPass/studentOutPassController');
const employeeOutPassController = require('./../controllers/outPass/employeeOutPassController');

//utilities
const uploadUserFile = require('./../utilities/fileUpload').uploadUserFile;
//validators
const createStudentOutPassValidator =
    require('./../validators/createStudentOutPassValidator').validate;

//routes
router.use(authController.verification);

//studentOutPass specific routes

router
    .route('/studentoutpass/getall/')
    .get(studentOutPassController.getAllStudentsAllOutPasses);

router
    .route('/studentoutpass/getall/:id')
    .get(studentOutPassController.getAllStudentOutPasses);

router
    .route('/studentoutpass/')
    .post(uploadUserFile, studentOutPassController.createStudentOutPass);
router
    .route('/studentoutpass/:id')
    .get(studentOutPassController.getSingleStudentOutPass)
    .delete(studentOutPassController.deleteSingleStudentOutPass);

router
    .route('/updatestudentoutpass/:id')
    .patch(studentOutPassController.updateSingleStudentOutPass);
router
    .route('/cancelstudentoutpass/:id')
    .patch(studentOutPassController.cancelSingleStudentOutPass);

//employeeOutPass specific routes
router
    .route('/employeeoutpass/getall/')
    .get(employeeOutPassController.getAllEmployeesAllOutPasses);

router
    .route('/employeeoutpass/getall/:id')
    .get(employeeOutPassController.getAllEmployeeOutPasses);
router
    .route('/employeeoutpass/')
    .post(uploadUserFile, employeeOutPassController.createEmployeeOutPass);
router
    .route('/employeeoutpass/:id')
    .get(employeeOutPassController.getSingleEmployeeOutPass)
    .delete(employeeOutPassController.deleteSingleEmployeeOutPass);

router
    .route('/updateemployeeoutpass/:id')
    .patch(employeeOutPassController.updateSingleEmployeeOutPass);
router
    .route('/cancelemployeeoutpass/:id')
    .patch(employeeOutPassController.cancelSingleEmployeeOutPass);

module.exports = router;
