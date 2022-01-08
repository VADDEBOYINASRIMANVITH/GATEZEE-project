export interface StudentRequest {
    outgoingDate: Date;
    createdAt: Date;
    outgoingTime: Date;
    incomingDate: Date;
    incomingTime: Date;
    reason: string;
    description: string;
    status: string; //(pending,cancelled,deleted,accepted,rejected,unread)
    belongsToStudent: string; //student Id
    belongsToStudentMongo: string; //student Mongo Id
    percentageOfEmergency: number;
    //by Admin or Employee or Hod.
    statusUpdatedBy: string; //employee,hod,admin-Id.
    statusUpdatedAt: Date; //by Admin or Employee or Hod.
    //by student
    detailsUpdatedAt: Date; //delete,cancel,edit
    //by security
    isAuthenticated: boolean;
    isAuthenticatedAt: Date;
    authenticatedBy: string; //securityId
    otp: string;
    fileName: string;
}
