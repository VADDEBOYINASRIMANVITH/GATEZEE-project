const cron = require('node-cron');

//execute cron job everyday at 00:05 (12:05 Am)
// module.exports= cron.schedule('5 0 * * *', () => {
//      console.log('hiee');
//      console.log(new Date());
// });
// Asia/Calcutta

// module.exports = cron.schedule('50 36 16 * * *', () => {
//      console.log('executing task for every 2 mins');
//      //  console.log(new Date().toLocaleDateString(undefined,{timeZone:'Asia/Kolkata'}));
//      console.log(new Date())
// }, { timeZone: 'Asia/Calcutta' })

exports.everyDayStudentRequestCronJob = (dataBaseObj) => {
    return cron.schedule(
        '30  2 0 * * *',
        () => {
            //execites at 00:02:30 everyday
            console.log('executing student EveryDay cronjob');
            const studentRequestColl = dataBaseObj.collection('studentrequest');
            const todayDate = new Date().toISOString().split('T')[0];
            studentRequestColl.updateMany(
                {
                    $and: [
                        { status: 'pending' },
                        { outgoingDate: { $lt: new Date(todayDate) } }
                    ]
                },
                { $set: { status: 'unread' } }
            );
            console.log(new Date());
        },
        { timeZone: 'Asia/Calcutta' }
    );
};

exports.everyDayEmployeeRequestCronJob = (dataBaseObj) => {
    return cron.schedule(
        '30  3 0 * * *',
        () => {
            //execites at 00:02:30 everyday
            console.log('executing Mentor EveryDay cronjob');
            const employeeRequestColl = dataBaseObj.collection(
                'employeerequest'
            );
            const todayDate = new Date().toISOString().split('T')[0];
            employeeRequestColl.updateMany(
                {
                    $and: [
                        { status: 'pending' },
                        { outgoingDate: { $lt: new Date(todayDate) } }
                    ]
                },
                { $set: { status: 'unread' } }
            );
            console.log(new Date());
        },
        { timeZone: 'Asia/Calcutta' }
    );
};
