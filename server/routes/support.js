const express = require('express');
const router = express.Router();
const { createSupportTicketDB } = require('../services/awsService');

// POST /api/support/cancel-policy
router.post('/cancel-policy', async (req, res) => {
    try {
        const { policyNumber, policyType, reason, details, email } = req.body;

        if (!policyNumber || !reason || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newRequest = {
            policyNumber,
            policyType,
            reason,
            details: details || '',
            email,
            status: 'Pending'
        };

        const result = await createSupportTicketDB(newRequest);

        res.status(201).json({
            message: 'Cancellation request submitted successfully',
            referenceId: result.id
        });

    } catch (error) {
        console.error('Error submitting cancellation against AWS:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
