require('dotenv').config();
const nodemailer = require('nodemailer');
const awsService = require('./awsService');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, body, type = 'Notification', attachments = []) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('[Email Simulation] Please set EMAIL_USER and EMAIL_PASS to send real emails.');
            console.log(`[Email Simulation] Sent to ${to}: ${subject}`);
            
            // Log to DynamoDB even if simulated, so Admin can see it
            await awsService.logEmailDB({ to, subject, body, type, status: 'Simulated' });
            return true;
        }

        const mailOptions = {
            from: `"ClaimEasy Admin" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: body,
            attachments: attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Real Email] Sent to ${to}: ${info.messageId}`);
        
        // Persist to DynamoDB Admin Emails table
        await awsService.logEmailDB({ to, subject, body, type, status: 'Sent' });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Log failure to database
        await awsService.logEmailDB({ to, subject, body, type, status: 'Failed' });
        return false;
    }
};

module.exports = { sendEmail };
