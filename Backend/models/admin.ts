export interface Admin {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    Id: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    designation: 'admin';
}
