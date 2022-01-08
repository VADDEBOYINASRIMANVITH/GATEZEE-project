const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const xss = require('xss-clean');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const timeout = require('connect-timeout');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
//local
const globalErrorHandler = require('./controllers/errorController').globalError;

const AppError = require('./utilities/appError');
const haltOnTimedout = require('./utilities/haltOnTimeOut');
const EveryDayStudentRequestCron =
    require('./utilities/cronJobs/EveryDayCronjob').everyDayStudentRequestCronJob;
const EveryDayEmployeeRequestCronJob =
    require('./utilities/cronJobs/EveryDayCronjob').everyDayEmployeeRequestCronJob;

app.use(bodyParser.json());
app.use(cors());
var dataBaseObj;

const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true
});
(async () => {
    try {
        await client.connect();
        console.log('CONNECTED TO MONGODB DATABASE');
        const dbo = client.db('GPMS');
        dataBaseObj = dbo;
        app.locals.studentCol = dbo.collection('student');
        app.locals.employeeCol = dbo.collection('employee');
        app.locals.hodCol = dbo.collection('hod');
        app.locals.adminCol = dbo.collection('admin');
        app.locals.superAdminCol = dbo.collection('superadmin');
        app.locals.studentRequestCol = dbo.collection('studentrequest');
        app.locals.employeeRequestCol = dbo.collection('employeerequest');
        app.locals.securityCol = dbo.collection('security');
        EveryDayStudentRequestCron(dataBaseObj).start();
        EveryDayEmployeeRequestCronJob(dataBaseObj).start();
    } catch (err) {
        console.log('SOME ERROR HAS OCCURED WHILE CONNECTING TO DB');
        console.log(err);
    }
})();

//set security HTTPS headers
app.use(helmet());
//implement rate headers
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from same Ip, please try again later!'
});
app.use('/api', limiter);

//Body parsser, reading  data from body into req.body
app.use(express.json({ limit: '1024kb' }));
app.use(express.urlencoded({ extended: true, limit: '1024kb' }));

// Data sanitization against NoSql query injection
//looks at {req.body,req.queryString,req.Params} and cleans out all dollar signs and dots in the input
app.use(mongoSanitize());

// Data sanitization against XSS basically converts all html symbols other symbols
app.use(xss());

// Compress the Output
app.use(compression());

// Logging Middleware
app.use(morgan('dev'));

// Check Server Timeout
app.use(timeout('200s'));
app.use(haltOnTimedout);

app.use(express.static('public'));

//all setHeaders- middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept,Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,PUT,PATCH,OPTIONS'
    );

    next();
});

//import routes
const authRouter = require('./routes/authRouter');
const studentRouter = require('./routes/studentRouter');
const employeeRouter = require('./routes/employeeRouter');
const hodRouter = require('./routes/hodRouter');
const adminRouter = require('./routes/adminRouter');
const securityRouter = require('./routes/securityRouter');
const outPassRouter = require('./routes/outPassRouter');
const fileRouter = require('./routes/fileRouter');

//routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/hod', hodRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/security', securityRouter);
app.use('/api/v1/outpass', outPassRouter);
app.use('/api/v1/file', fileRouter);

//routes which are out of the app
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 500));
});

//Error handing in one central place
app.use(globalErrorHandler);

module.exports = app;
