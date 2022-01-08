const exp = require('express');
const router = exp.Router();
//controllers
const authController = require('./../controllers/authController');
const fileController = require('./../controllers/fileController');

//verify
//authController.verification();

router.post('/userfile', fileController.getUserFile);
router.post('/userimage', fileController.getUserImage);

module.exports = router;
