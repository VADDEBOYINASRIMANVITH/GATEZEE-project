export interface Hod {
    name: string;
    email: string;
    phone: string;
    department: string;
    Id: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    gender: string;
    designation: 'hod';
    subjects: [string];
}
