const { check, validationResult } = require('express-validator');
const returnMillisec = require('../utilities/returnMillisec');
exports.validate = [
     check('outgoingDate').exists()
          .withMessage('outgoingDate is mandatory'),
     check('outgoingTime').exists()
          .withMessage('outgoing time is mandatory'),
     check('reason').exists()
          .withMessage('Reason is mandatory'),
     check('incomingTime').custom((value, { req }) => {
          if (value == undefined || value == '')
          {
               return true;
          }
          ot = returnMillisec(req.body.outgoingTime);
          it = returnMillisec(req.body.incomingTime);
          if (it <= ot)
          {
                throw new Error('Incoming Time is less than outgoing time');  
          }
          return true;
     }),
     function (req, res, next) {
          const error = validationResult(req);
           if (error.isEmpty())
          {
             return  next(); 
          }
          const extractedErrors = []
          error.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
            return res.status(422).json({
          errors: extractedErrors,
          })
     }
     
]