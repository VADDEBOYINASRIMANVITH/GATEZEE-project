exports.getCollection = (role, reqApp) => {
    let coll;

    if (role === 'student') {
        coll = reqApp.studentCol;
    } else if (role === 'employee') {
        coll = reqApp.employeeCol;
    } else if (role === 'hod') {
        coll = reqApp.hodCol;
    } else if (role === 'admin') {
        coll = reqApp.adminCol;
    } else if (role === 'superAdmin') {
        coll = reqApp.superAdminCol;
    } else coll = reqApp.securityCol;
    return { coll: coll };
};

// getCollectionByField(field, value, arrayOfCollections, reqapp)

// return collection_object
// else error
