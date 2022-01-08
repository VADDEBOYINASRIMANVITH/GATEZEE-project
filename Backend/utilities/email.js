const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user) {
        this.to = user.email;
    }

    createTransport() {
        return nodemailer.createTransport({
            service: 'SendGrid',

            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD
            }
        });
    }

    async send(subject, html, message) {
        const mailOptions = {
            from: '"GATEZEE - VNR VJIET "<gatemanagement2021@gmail.com>',
            to: this.to,
            subject: subject,
            html: html,
            text: message
        };
        await this.createTransport().sendMail(mailOptions);
    }
};
