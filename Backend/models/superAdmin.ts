export interface SuperAdmin {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phone: string;
    Id: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    designation: 'superAdmin';
}
