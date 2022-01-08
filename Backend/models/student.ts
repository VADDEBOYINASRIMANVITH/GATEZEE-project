export interface Student {
    name: string;
    email: string;
    phone: string;
    parentPhone: string;
    parentEmail: string;
    gender: string;
    department: string;
    batch: string; //2017-2021
    year: string;
    Id: string;
    attendance: number;
    belongsToEmployee: string; //Employee Id
    belongsToHod: string; //Hod Id
    belongsToEmployeeMongo: string;
    belongsToHodMongo: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    designation: 'student';
    imageFileName: string;
    status: string; //active,detained,passout,dropout
}
