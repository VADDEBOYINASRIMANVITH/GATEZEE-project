//by shiva

const catchAsync = require('../../utilities/catchAsync');
const AppError = require('../../utilities/appError');

exports.getAllStudentsAssociatedRequests = catchAsync(
    async (req, res, next) => {
        console.log('In getAllstudentsAssociatedRequests --> ByHod');
        if (res.locals.userObj.designation !== 'hod') {
            return next(new AppError(`Cannot have access to this route`, 401));
        }
        const todayDate = new Date().toISOString().split('T')[0];
        const data = await req.app.locals.studentRequestCol
            .find({
                $and: [
                    { belongsToHod: res.locals.userObj.Id },
                    { status: 'pending' },
                    { outgoingDate: { $gte: new Date(todayDate) } }
                ]
            })
            .toArray();
        res.status(200).json({ data: data });
    }
);
