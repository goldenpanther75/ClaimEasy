const express = require('express');
const router = express.Router();
const { createPolicy, getPolicies } = require('../services/dynamoService');
const { sendWhatsAppNotification } = require('../services/notificationService');
const { sendEmail } = require('../services/emailService');
const { generatePolicyPDF } = require('../services/pdfService');

const { createPolicyDB, getAllPoliciesDB } = require('../services/awsService');

// POST /api/policies - Create a new policy application
router.post('/', async (req, res) => {
    try {
        const policyData = req.body;
        // Save to AWS DynamoDB
        const dbResult = await createPolicyDB(policyData);

        // Send WhatsApp Notification (Simulation)
        if (policyData.mobile) {
            const message = `Dear ${policyData.fullName || 'User'}, your policy ${dbResult.policyId} has been successfully created. Download it from your dashboard.`;
            await sendWhatsAppNotification(policyData.mobile, message);
        }

        // Send Email Notification (Non-blocking)
        if (policyData.email) {
            const subject = `Policy Document - ${dbResult.policyId}`;
            const body = `Dear ${policyData.fullName || 'User'},<br><br>Your policy has been issued successfully.<br>Policy Number: ${dbResult.policyId}<br>Plan: ${policyData.planName || 'Insurance Plan'}<br><br>Thank you for choosing ClaimEasy.`;
            
            // Generate PDF and send in background
            generatePolicyPDF(policyData.type || 'Insurance', {}, policyData)
                .then(pdfBuffer => {
                    sendEmail(policyData.email, subject, body, 'Policy Issuance', [
                        { filename: 'ClaimEasy_Summary.pdf', content: pdfBuffer }
                    ]);
                })
                .catch(err => console.error("PDF generation failed for initial issuance:", err));
        }

        res.status(201).json({ ...dbResult, notificationSent: true });
    } catch (error) {
        console.error("Error in policy creation:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/policies/verify - Verify policy details for claim
router.post('/verify', (req, res) => {
    const { policyNumber, mobile } = req.body;

    if (!policyNumber || !mobile) {
        return res.status(400).json({ success: false, message: "Policy Number and Mobile are required" });
    }

    // Fetch all policies from DynamoDB first
    getAllPoliciesDB()
        .then(policies => {
            // Check for match (Loose comparison for robustness)
            const policy = policies.find(p =>
                (p.policyId === policyNumber || p.policyId === policyNumber.trim()) &&
                (p.mobile === mobile || p.mobile === mobile.trim())
            );

            if (policy) {
                res.json({ success: true, message: "Policy Verified", holderName: policy.fullName });
            } else {
                res.status(404).json({ success: false, message: "No matching policy found. Please check your details." });
            }
        })
        .catch(e => {
            console.error("Error verifying policy against AWS:", e);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        });
});

// GET /api/policies - Retrieve all policies (for admin/testing)
router.get('/', async (req, res) => {
    try {
        const policies = await getAllPoliciesDB();
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/policies/renew-check - Check if policy is eligible for renewal
router.post('/renew-check', (req, res) => {
    const { policyNumber, mobile } = req.body;

    if (!policyNumber || !mobile) {
        return res.status(400).json({ success: false, message: "Policy Number and Mobile are required" });
    }

    // Fetch all policies from DynamoDB first
    getAllPoliciesDB()
        .then(policies => {
            const policy = policies.find(p =>
                (p.policyId === policyNumber || p.policyId === policyNumber.trim()) &&
                (p.mobile === mobile || p.mobile === mobile.trim())
            );

            if (policy) {
                // Calculate dummy renewal premium (e.g., base it on existing premium or random for demo)
                const basePremium = parseInt(policy.premium || "5000");
                const renewalPremium = Math.round(basePremium * 1.05); // 5% increase for renewal

                // Calculate new dates
                const currentExpiry = new Date(); // assume it expires today for demo
                currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);
                const newExpiryDate = currentExpiry.toLocaleDateString();

                res.json({
                    success: true,
                    message: "Policy Found",
                    policy: {
                        ...policy,
                        renewalPremium: renewalPremium,
                        newExpiryDate: newExpiryDate
                    }
                });
            } else {
                res.status(404).json({ success: false, message: "No matching policy found for renewal." });
            }
        })
        .catch(e => {
            console.error("Error checking renewal policy against AWS:", e);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        });
});

// POST /api/policies/send-receipt - Send HTML confirmation email
router.post('/send-receipt', async (req, res) => {
    try {
        const { policyType, planData, userData } = req.body;
        console.log(`[Receipt] Initiating for type: ${policyType} to user details found.`);
        
        // Try various common e-mail keys depending on the form
        const toEmail = userData?.Email || userData?.email || userData?.['Email ID'] || userData?.emailAddress;
        const name = userData?.Name || userData?.name || userData?.['Full Name'] || userData?.ownerName || 'Customer';

        if (!toEmail) {
             console.error("[Receipt] No email found in request userData:", userData);
             return res.status(400).json({ success: false, message: "No email address provided." });
        }

        console.log(`[Receipt] Targeted email: ${toEmail}`);

        const subject = `Policy Issued Successfully - ${policyType} Insurance`;

        // Map plan details to table rows
        let planRows = '';
        if (planData) {
            Object.entries(planData).forEach(([key, val]) => {
                const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                planRows += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555; font-weight: bold; width: 40%;">${cleanKey}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${val}</td>
                    </tr>
                `;
            });
        }

        // Map user details to table rows
        let userRows = '';
        if (userData) {
            const ignoreKeys = ['type', 'premium', 'status'];
            Object.entries(userData).forEach(([key, val]) => {
                if (ignoreKeys.includes(key.toLowerCase())) return;
                const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                userRows += `
                    <tr>
                        <td style="padding: 8px 10px; border-bottom: 1px dashed #eee; color: #666; font-size: 13px; width: 40%;">${cleanKey}</td>
                        <td style="padding: 8px 10px; border-bottom: 1px dashed #eee; color: #222; font-size: 13px;">${val}</td>
                    </tr>
                `;
            });
        }

        // Beautiful HTML Email Template
        const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .header { background-color: #0065ff; padding: 25px 20px; text-align: center; color: white; }
                .logo { font-size: 24px; font-weight: bold; margin: 0; }
                .sub-logo { font-size: 12px; opacity: 0.8; }
                .content { padding: 30px; }
                .success-icon { text-align: center; margin-bottom: 20px; }
                .success-icon img { width: 64px; height: 64px; }
                .title { color: #333; font-size: 22px; text-align: center; margin-bottom: 5px; }
                .subtitle { color: #666; font-size: 15px; text-align: center; margin-bottom: 30px; }
                .section-title { background: #f8f9fa; border-left: 4px solid #ff5722; padding: 8px 15px; font-size: 14px; font-weight: bold; color: #333; margin: 25px 0 15px 0; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .footer { background: #f8f9fa; border-top: 1px solid #eee; padding: 20px; text-align: center; color: #888; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <p class="logo">ClaimEasy</p>
                    <p class="sub-logo">Insurance Simplified</p>
                </div>
                
                <div class="content">
                    <div class="success-icon">
                        <!-- Green Checkmark Hosted on public CDN -->
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success">
                    </div>
                    
                    <h1 class="title">Policy Issued Successfully!</h1>
                    <p class="subtitle">Dear ${name}, your ${policyType} Insurance is now active.</p>

                    <div class="section-title">PLAN SELECTION</div>
                    <table>
                        ${planRows}
                    </table>

                    <div class="section-title">APPLICANT & DETAILS</div>
                    <table>
                        ${userRows}
                    </table>

                    <p style="text-align: center; margin-top: 30px; padding: 15px; background: #e8f5e9; color: #2e7d32; border-radius: 4px; font-weight: bold;">
                        An official copy of your Application Summary is attached to this email.
                    </p>
                </div>

                <div class="footer">
                    &copy; ${new Date().getFullYear()} ClaimEasy Insurance Services.<br>
                    Support: 1800-123-4567 | support@claimeasy.com
                </div>
            </div>
        </body>
        </html>
        `;

        // Respond immediately to the client to stop "Processing" hang
        res.json({ success: true, message: "Receipt process initiated." });

        // Background heavy lifting: Generate PDF and Send Email
        generatePolicyPDF(policyType, planData, userData)
            .then(pdfBuffer => {
                return sendEmail(toEmail, subject, htmlBody, 'Policy Issuance', [
                    { filename: `ClaimEasy_${policyType}_Summary.pdf`, content: pdfBuffer }
                ]);
            })
            .catch(bgError => {
                console.error("Background Receipt Processing Failed:", bgError);
            });

    } catch (error) {
        console.error("Error initiating receipt:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Failed to initiate receipt." });
        }
    }
});

module.exports = router;
