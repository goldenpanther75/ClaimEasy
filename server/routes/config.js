const express = require('express');
const router = express.Router();
const { getConfigDB, updateConfigCategoryDB, logActionDB } = require('../services/awsService');

// GET /api/config - Public route to fetch configuration
router.get('/', async (req, res) => {
    const config = await getConfigDB();
    res.json(config);
});

// POST /api/admin/config/update - Admin route to update configuration
router.post('/update', async (req, res) => {
    const adminEmail = req.headers['x-admin-email'];
    const role = req.headers['x-role'];

    // Verify simple admin role (matching admin.js logic)
    if (role !== 'admin') {
        return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    const { category, data } = req.body;

    // We update the specific category in the DB
    const success = await updateConfigCategoryDB(category, data);

    if (success) {
        // Log this action in AWS
        await logActionDB({
            action: "UPDATE_CONFIG",
            performedBy: adminEmail || 'Admin',
            details: `Updated config category: ${category}`
        });

        const updatedConfig = await getConfigDB();
        res.json({ success: true, message: "Configuration Updated", config: updatedConfig });
    } else {
        res.status(500).json({ error: "Failed to save configuration" });
    }
});

module.exports = router;
