const express = require('express');
const router = express.Router();
const { createUserDB, getAllUsersDB } = require('../services/awsService');
const { sendEmail } = require('../services/emailService');

// Temporary storage for OTPs (in memory)
const otpStore = {};

// Generate and Send OTP
router.post('/send-otp', async (req, res) => {
    const { identifier, isSignup } = req.body; // Phone or Email

    if (!identifier) {
        return res.status(400).json({ message: 'Identifier (phone or email) is required' });
    }

    try {
        const users = await getAllUsersDB();
        const existingUser = users.find(u => u.phone === identifier || u.email === identifier);

        if (isSignup && existingUser) {
            return res.json({ success: false, message: 'Account already exists. Please log in.' });
        }
        if (!isSignup && !existingUser && identifier !== 'goldenpanther75@gmail.com') {
            return res.json({ success: false, message: 'Account not found. Please click Sign up to create an account.' });
        }
    } catch (err) {
        console.error("Error checking user existence:", err);
        // If DB check fails, we still allow proceeding (fallback)
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    otpStore[identifier] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000
    };

    console.log(`============================================`);
    console.log(`OTP for ${identifier}: ${otp}`);
    console.log(`============================================`);

    // 1. Prepare Email Content
    const emailSubject = `Your ClaimEasy Login OTP: ${otp}`;
    const emailBody = `Hello,\n\nYour One-Time Password for logging into ClaimEasy is: ${otp}\n\nThis code will expire in 5 minutes.\n\n- The ClaimEasy Team`;

    // 2. Determine Recipients
    const userEmail = identifier.includes('@') ? identifier : 'user@example.com';
    const adminEmail = process.env.EMAIL_USER || 'admin@claimeasy.com';

    // 3. Send Emails asynchronously
    sendEmail(userEmail, emailSubject, emailBody);
    sendEmail(adminEmail, `[ADMIN COPY] User Requested OTP: ${identifier}`, `A user (${identifier}) has just requested an OTP to login.\n\nTheir OTP is: ${otp}`);

    res.json({ message: 'OTP sent successfully', success: true, otp: otp });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    const storedData = otpStore[identifier];

    if (!storedData) {
        return res.status(400).json({ message: 'OTP not requested or expired', success: false });
    }

    if (Date.now() > storedData.expires) {
        delete otpStore[identifier];
        return res.status(400).json({ message: 'OTP expired', success: false });
    }

    if (storedData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    try {
        // Clear OTP after success
        delete otpStore[identifier];

        // Failsafe Bypass for Super Admin
        if (identifier === 'goldenpanther75@gmail.com') {
            return res.json({
                success: true,
                isNewUser: false,
                role: 'admin',
                user: { name: 'Super Admin', email: 'goldenpanther75@gmail.com' },
                token: 'mock-admin-token-' + Date.now()
            });
        }

        // OTP Verified. Check if user exists in AWS DynamoDB.
        const users = await getAllUsersDB();
        const existingUser = users.find(u => u.phone === identifier || u.email === identifier);

        if (existingUser) {
            return res.json({
                success: true,
                isNewUser: false,
                user: existingUser,
                token: 'mock-jwt-token-' + Date.now()
            });
        } else {
            return res.json({
                success: true,
                isNewUser: true,
                token: 'mock-temp-token-' + Date.now()
            });
        }
    } catch (err) {
        console.error("AWS Error verifying OTP user status: ", err);
        return res.status(500).json({ message: 'Internal Server Error during OTP verification' });
    }
});

// Register User
router.post('/register', async (req, res) => {
    const { name, phone, email, dob, gender, address } = req.body;

    if (!name || (!phone && !email)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const users = await getAllUsersDB();

        // Check duplication
        const duplicate = users.find(u => (phone && u.phone === phone) || (email && u.email === email));
        if (duplicate) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        const newUser = {
            name,
            phone,
            email,
            dob,
            gender,
            address, // Save address object
        };

        const result = await createUserDB(newUser); // Saves user to the Cloud

        res.json({
            success: true,
            user: result.user,
            message: 'Registration successful'
        });
    } catch (err) {
        console.error("AWS DynamoDB Error registering User:", err);
        res.status(500).json({ success: false, message: 'Internal Server Database Error' });
    }
});

module.exports = router;
