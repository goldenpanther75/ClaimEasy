const express = require('express');
const router = express.Router();
const { createClaimDB, getAllClaimsDB, getAllPoliciesDB } = require('../services/awsService');
const { sendEmail } = require('../services/emailService');

// POST /api/claims - Submit a new claim
router.post('/', async (req, res) => {
    try {
        const { userId, policyType, amount, reason, email, policyNumber, mobile, ...otherDetails } = req.body;

        if (!policyNumber || !amount) {
            return res.status(400).json({ error: "Missing required fields: Policy Number and Amount" });
        }

        // Validate Policy Existence via AWS
        const policies = await getAllPoliciesDB();

        // Loose check to handle potential whitespace or case issues
        const validPolicy = policies.find(p =>
            (p.policyId === policyNumber.trim()) &&
            (!mobile || p.mobile === mobile.trim()) // Validate mobile if provided
        );

        if (!validPolicy) {
            return res.status(403).json({
                error: "Invalid Policy Details. You can only file claims for purchased policies."
            });
        }

        const newClaimData = {
            userId: userId || policyNumber, // Use policyNumber as userId if not provided
            policyNumber: policyNumber,
            policyType: policyType || validPolicy.planName || "General",
            amount: amount,
            reason: reason || "No reason provided",
            email: email || validPolicy.email,
            mobile: mobile || validPolicy.mobile,
            holderName: validPolicy.fullName,
            ...otherDetails
        };

        const dbResult = await createClaimDB(newClaimData);

        // Send Email Notification
        const notifyEmail = email || validPolicy.email;
        if (notifyEmail) {
            sendEmail(notifyEmail, `Claim Received - ${dbResult.claimId}`, `Your claim for ₹${amount} has been received and is under review. Reference ID: ${dbResult.claimId}`, 'Claim Intimation');
        }

        res.status(201).json({ success: true, message: "Claim submitted successfully", claimId: dbResult.claimId });
    } catch (error) {
        console.error("Claim Submission Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/claims/:id - Track claim status
router.get('/:id', async (req, res) => {
    try {
        const claims = await getAllClaimsDB();
        const claim = claims.find(c => c.claimId === req.params.id || c.id === req.params.id);

        if (claim) {
            res.status(200).json(claim);
        } else {
            res.status(404).json({ error: "Claim not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
