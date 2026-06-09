const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getAllClaimsDB, getAllPoliciesDB, getAllUsersDB } = require('../services/awsService');

// POST /api/chat - Chatbot interaction
router.post('/', async (req, res) => {
    try {
        const { message, context } = req.body; 
        const cleanMsg = message.trim().toLowerCase();
        const role = context?.role || 'user';

        // --- RESPONSIBLE GUARDRAIL ---
        // If user is NOT admin and asks for sensitive info, block it with the specific message.
        const sensitiveKeywords = ['policy', 'claim', 'user', 'email', 'mobile', 'phone', 'address', 'password', 'database', 'clm', 'pol'];
        if (role !== 'admin' && sensitiveKeywords.some(word => cleanMsg.includes(word))) {
            return res.json({
                response: "it is personalized information; I am not providing it to you"
            });
        }

        // --- ADMIN SPECIALIZED SEARCH ---
        if (role === 'admin') {
            // 1. Search for Claim ID
            const claimIdMatch = cleanMsg.match(/(?:clm|claim id)[\s-]*(\d+)/i);
            if (claimIdMatch || cleanMsg.startsWith('clm')) {
                const searchId = claimIdMatch ? `CLM${claimIdMatch[1]}` : cleanMsg.toUpperCase().replace(/\s/g, '');
                const claims = await getAllClaimsDB();
                const claim = claims.find(c => c.claimId === searchId || c.id === searchId);
                
                if (claim) {
                    return res.json({
                        response: `<strong>Claim Found: ${claim.claimId}</strong><br>
                        <div style="background:#fff; border:1px solid #0065ff; padding:12px; border-radius:8px; margin-top:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <div style="margin-bottom:5px;">👤 Holder: <strong>${claim.holderName || claim.userId}</strong></div>
                            <div style="margin-bottom:5px;">📊 Status: <strong style="color:#0065ff;">${claim.status}</strong></div>
                            <div style="margin-bottom:5px;">💰 Amount: <strong>₹${claim.amount}</strong></div>
                            <div>📅 Date: ${new Date(claim.submittedAt || claim.createdAt).toLocaleDateString()}</div>
                        </div>`
                    });
                }
            }

            // 2. Search for Policy ID
            const policyIdMatch = cleanMsg.match(/(?:pol|policy id)[\s-]*(\d+)/i);
            if (policyIdMatch || cleanMsg.startsWith('pol')) {
                const searchId = policyIdMatch ? `POL${policyIdMatch[1]}` : cleanMsg.toUpperCase().replace(/\s/g, '');
                const policies = await getAllPoliciesDB();
                const policy = policies.find(p => p.policyId === searchId || p.id === searchId);

                if (policy) {
                    return res.json({
                        response: `<strong>Policy Found: ${policy.policyId}</strong><br>
                        <div style="background:#fff; border:1px solid #28a745; padding:12px; border-radius:8px; margin-top:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <div style="margin-bottom:5px;">🛡️ Plan: <strong>${policy.planName || policy.type}</strong></div>
                            <div style="margin-bottom:5px;">👤 Owner: <strong>${policy.fullName || policy.name}</strong></div>
                            <div style="margin-bottom:5px;">📅 Coverage: ${policy.coverage}</div>
                            <div>💳 Premium: <strong>₹${policy.premium}</strong></div>
                        </div>`
                    });
                }
            }

            // 3. Search for User Details
            if (cleanMsg.includes('user') || cleanMsg.includes('info about')) {
                const users = await getAllUsersDB();
                const targetUser = users.find(u => 
                    cleanMsg.includes(u.email?.toLowerCase()) || 
                    cleanMsg.includes(u.name?.toLowerCase()) || 
                    cleanMsg.includes(u.id?.toLowerCase())
                );

                if (targetUser) {
                    // Also get their policies and claims
                    const allPolicies = await getAllPoliciesDB();
                    const allClaims = await getAllClaimsDB();
                    
                    const userPolicies = allPolicies.filter(p => p.email === targetUser.email || p.userId === targetUser.id);
                    const userClaims = allClaims.filter(c => c.email === targetUser.email || c.userId === targetUser.id);

                    let summary = `<strong>User Profile: ${targetUser.name}</strong><br>
                    <div style="background:#fff; border:1px solid #666; padding:12px; border-radius:8px; margin-top:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        <div>📧 Email: ${targetUser.email}</div>
                        <div>📱 Mobile: ${targetUser.mobile || 'N/A'}</div>
                        <hr style="border:0; border-top:1px solid #eee; margin:8px 0;">
                        <div>📜 Policies: <strong>${userPolicies.length} Active</strong></div>
                        <div>📂 Claims: <strong>${userClaims.length} Filed</strong></div>
                    </div>`;
                    
                    if(userPolicies.length > 0) {
                        summary += `<br><em>Top Policy: ${userPolicies[0].planName} (${userPolicies[0].policyId})</em>`;
                    }
                    
                    return res.json({ response: summary });
                }
            }
        }

        // --- Standard Bot Logic ---
        const products = ['car', 'bike', 'health', 'travel', 'term', 'home'];
        let detectedProduct = '';
        for (let p of products) { if (cleanMsg.includes(p)) { detectedProduct = p; break; } }

        if (cleanMsg.includes('hi') || cleanMsg.includes('hello')) {
            return res.json({
                response: `Hello! 👋 I am your ClaimEasy Assistant. ${role === 'admin' ? 'I am in Admin Mode. How can I pull data for you today?' : 'I can help you with Quotes and Claims. How can I help?'}`
            });
        }

        if (cleanMsg.includes('file') || cleanMsg.includes('claim')) {
            return res.json({
                response: "To file a new claim, please visit our <strong>Claim Assistance</strong> page.<br><br><a href='claim_intimation.html' class='chat-chip'>File a Claim</a>"
            });
        }

        // Fallback
        return res.json({
            response: role === 'admin' ? 
                "Admin, you can query database records by typing names or IDs (e.g. 'POL123' or 'details for user@abc.com')." : 
                "I am here to assist with general information. For private data, please log in or contact support."
        });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;
