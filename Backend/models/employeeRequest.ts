export interface EmployeeRequest {
    outgoingDate: Date;
    createdAt: Date;
    outgoingTime: Date;
    incomingDate: Date;
    incomingTime: Date;
    reason: string;
    description: string;
    percentageOfEmergency: number;
    status: string; //(pending,cancelled,deleted,accepted,rejected)
    belongsToEmployee: string; //EMployee Id
    belongsToEmployeeMongo: string; //Employee Mongo Id
    //by Hod
    statusUpdatedBy: string; //hod,admin-Id
    statusUpdatedAt: Date;
    //by employee
    detailsUpdatedAt: Date;
    //by security
    isAuthenticated: boolean;
    authenticatedBy: string;
    isAuthenticatedAt: Date;
    //otps and file
    otp: string;
    fileName: string;
}
