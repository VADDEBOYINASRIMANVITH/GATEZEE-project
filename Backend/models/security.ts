export interface Security {
    name: string;
    email: string;
    phone: string;
    Id: string;
    password: string;
    lastPasswordChangedAt: Date;
    lastTokenGeneratedAt: Date;
    resetPasswordExpiresAt: Date;
    passwordResetToken: Date;
    designation: 'security';
}
