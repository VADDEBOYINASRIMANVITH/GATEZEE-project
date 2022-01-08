export interface Employee {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    Id: string;
    belongsToHod: string; //Hod Id
    belongsToHodMongo: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    gender: string;
    designation: 'employee';
    subjects: [string];
    imageFileName: string;
    status: string; //active,resigned,contract,intern
}
