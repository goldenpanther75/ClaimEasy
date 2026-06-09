const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
const awsService = require('../services/awsService');

// --- Helpers ---
const readJSON = (file) => {
    try {
        if (!fs.existsSync(file)) return [];
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
        console.error("Read Error:", err);
        return [];
    }
};

const writeJSON = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Write Error:", err);
        return false;
    }
};

// --- Middleware: Verify Admin Role (Simulated) ---
// In a real app, this would check JWT/Session
const isAdmin = (req, res, next) => {
    const { role } = req.body; // Expecting role in body for this simple demo
    // OR check a custom header 'x-role'
    const headerRole = req.headers['x-role'];

    if (role === 'admin' || role === 'manager' || headerRole === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Access Denied. Admins only." });
    }
};

// --- Logger Helper ---
const logAction = async (action, performedBy, details = "") => {
    await awsService.logActionDB({ action, performedBy, details });
};

// --- LOGS ENDPOINT ---
router.get('/logs', async (req, res) => {
    const logs = await awsService.getAllLogsDB();
    res.json(logs);
});

// --- EMAILS ENDPOINT ---
router.get('/emails', async (req, res) => {
    const emails = await awsService.getAllEmailsDB();
    res.json(emails);
});


// --- AUTH ---
// POST /api/admin/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Failsafe Super Admin Check (Bypasses DB intentionally)
    if (email === 'goldenpanther75@gmail.com' && password === 'ADMIN!@#$1') {
        logAction("LOGIN", email, "Failsafe Demo Admin Login");
        return res.json({ success: true, user: { name: 'Super Admin', role: 'admin', id: 'admin1', email: 'goldenpanther75@gmail.com' } });
    }

    // 2. Standard DB Users Check
    try {
        const users = await awsService.getAllUsersDB();
        const user = users.find(u => (u.email === email || u.mobile === email) && (u.password === password || u.password === 'admin123' || u.password === 'admin')); // fallback password check

        if (user) {
            if (user.role === 'admin' || user.role === 'manager') {
                logAction("LOGIN", user.email, "Admin/Manager Login Success");
                res.json({ success: true, user: { name: user.name, role: user.role, id: user.id, email: user.email } });
            } else {
                logAction("LOGIN_FAILED", email, "Unauthorized Role Access Attempt");
                res.status(401).json({ error: "Unauthorized. Admin access required." });
            }
        } else {
            logAction("LOGIN_FAILED", email, "Invalid Credentials");
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.error("AWS Auth Error:", err);
        res.status(500).json({ error: "Internal Auth Error" });
    }
});

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
    try {
        const users = await awsService.getAllUsersDB();
        const claims = await awsService.getAllClaimsDB();
        const policies = await awsService.getAllPoliciesDB();

        res.json({
            totalUsers: users.length,
            totalClaims: claims.length,
            pendingClaims: claims.filter(c => c.status === 'Pending').length,
            activePolicies: policies.length
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// --- USER MANAGEMENT ---
router.get('/users', async (req, res) => {
    try {
        const users = await awsService.getAllUsersDB();
        const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role || 'user', status: u.status || 'Active' }));
        res.json(safeUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user list from AWS." });
    }
});

router.post('/users/update-role', async (req, res) => {
    const { userId, newRole } = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';

    try {
        // Technically needs an update SDK function built, but we'll leave skeleton
        logAction("UPDATE_ROLE", adminEmail, `Simulated changing user ${userId} to ${newRole} (AWS Sync Required)`);
        res.json({ success: true, message: "Role Updated (Simulation)" });
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
});

// --- CLAIM MANAGEMENT ---
router.get('/claims', async (req, res) => {
    try {
        const claims = await awsService.getAllClaimsDB();
        res.json(claims);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch claims" });
    }
});

router.post('/claims/update', async (req, res) => {
    const { claimId, status, notes } = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';

    try {
        const oldClaim = await awsService.getClaimByIdDB(claimId);
        if (oldClaim) {
            const updateData = { ...oldClaim, status };
            if (notes) updateData.notes = notes;
            await awsService.updateClaimDB(claimId, updateData);
            logAction("UPDATE_CLAIM", adminEmail, `Updated Claim ${claimId} status: ${oldClaim.status} -> ${status}`);
            res.json({ success: true, message: "Claim Updated in AWS" });
        } else {
            res.status(404).json({ error: "Claim not found in AWS" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update claim" });
    }
});

// POST /api/admin/claims/create (For Testing/Demo purposes)
router.post('/claims/create', async (req, res) => {
    const { userId, policyType, amount, reason } = req.body;
    try {
        const newClaimData = { userId, policyType, amount, reason };
        const result = await awsService.createClaimDB(newClaimData);
        res.json({ success: true, claimId: result.claimId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create test claim" });
    }
});

// --- POLICY MANAGEMENT ---
router.get('/policies', async (req, res) => {
    try {
        const policies = await awsService.getAllPoliciesDB();
        res.json(policies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch policies" });
    }
});

router.post('/policies/add', async (req, res) => {
    const policyData = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';

    try {
        await awsService.createPolicyDB(policyData);
        logAction("ADD_POLICY", adminEmail, `Added new policy: AWS Form App`);
        res.json({ success: true, message: "Policy Added to AWS" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add policy to AWS" });
    }
});

router.post('/policies/update', async (req, res) => {
    const updateData = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';

    let policyId = updateData.id || updateData.policyId; // Check frontend id fields

    try {
        const existing = await awsService.getPolicyByIdDB(policyId);
        if (existing) {
            await awsService.updatePolicyDB(policyId, updateData);
            logAction("UPDATE_POLICY", adminEmail, `Updated AWS policy: ${policyId}`);
            res.json({ success: true, message: "Policy Updated in AWS" });
        } else {
            res.status(404).json({ error: "Policy not found in AWS" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update policy" });
    }
});

router.post('/policies/delete', async (req, res) => {
    const { id, policyId } = req.body;
    let targetId = id || policyId;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';

    try {
        const existing = await awsService.getPolicyByIdDB(targetId);
        if (existing) {
            await awsService.deletePolicyDB(targetId);
            logAction("DELETE_POLICY", adminEmail, `Deleted AWS policy ID: ${targetId}`);
            res.json({ success: true, message: "Policy Deleted from AWS" });
        } else {
            res.status(404).json({ error: "Policy not found in AWS" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to delete policy from AWS" });
    }
});

// --- SOURCE PAGE EDITOR API ---
const rootDir = path.join(__dirname, '../../');

// List HTML files
router.get('/pages', (req, res) => {
    try {
        const files = fs.readdirSync(rootDir);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        res.json({ success: true, files: htmlFiles });
    } catch (err) {
        res.status(500).json({ error: "Failed to read directory" });
    }
});

// Read HTML file content
router.get('/pages/read', (req, res) => {
    const filename = req.query.file;

    // Security check: Only allow .html files in the root dir
    if (!filename || !filename.endsWith('.html') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ error: "Invalid filename" });
    }

    const filePath = path.join(rootDir, filename);

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, content });
    } catch (err) {
        res.status(500).json({ error: "Failed to read file" });
    }
});

// Write HTML file content
router.post('/pages/write', (req, res) => {
    const { filename, content } = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'Unknown Admin';
    const role = req.headers['x-role'];

    // Additional simple role check just to be sure
    if (role !== 'admin') {
        return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    // Security check: Only allow .html files in the root dir
    if (!filename || !filename.endsWith('.html') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ error: "Invalid filename" });
    }

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    const filePath = path.join(rootDir, filename);

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        fs.writeFileSync(filePath, content, 'utf8');
        logAction("EDIT_PAGE_SOURCE", adminEmail, `Edited source code for: ${filename}`);
        res.json({ success: true, message: "File saved successfully" });
    } catch (err) {
        console.error("File Write Error:", err);
        res.status(500).json({ error: "Failed to save file" });
    }
});

module.exports = router;
