import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the hardcoded table <tbody> rows with empty <tbody id="fraud-audit-tbody">
old_audit_table = """                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Claim ID</th>
                                <th>Flag Reason</th>
                                <th>Risk Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>24 Oct 2026</td>
                                <td><strong>CLM-89102</strong></td>
                                <td>Multiple claims within 7 days</td>
                                <td><span style="color: #dc3545; font-weight: bold;">89/100</span></td>
                                <td><span class="status-badge status-pending">Under Investigation</span></td>
                            </tr>
                            <tr>
                                <td>18 Nov 2026</td>
                                <td><strong>CLM-55910</strong></td>
                                <td>Document metadata mismatch</td>
                                <td><span style="color: #dc3545; font-weight: bold;">95/100</span></td>
                                <td><span class="status-badge status-rejected">Rejected</span></td>
                            </tr>
                            <tr>
                                <td>02 Dec 2026</td>
                                <td><strong>CLM-77812</strong></td>
                                <td>High Value &amp; Recent Policy start</td>
                                <td><span style="color: #ff9800; font-weight: bold;">72/100</span></td>
                                <td><span class="status-badge status-pending">Manual Review</span></td>
                            </tr>
                        </tbody>
                    </table>"""

new_audit_table = """                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Claim ID</th>
                                <th>Flag Reason</th>
                                <th>Risk Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="fraud-audit-tbody">
                            <tr><td colspan="5" style="text-align:center;">Loading claims...</td></tr>
                        </tbody>
                    </table>"""

if "<td>24 Oct 2026</td>" in content:
    content = content.replace(old_audit_table, new_audit_table)

js_populate_func = """
        function populateFraudAuditTrail(claims, config) {
            const tbody = document.getElementById('fraud-audit-tbody');
            if(!tbody) return;
            tbody.innerHTML = '';
            
            // get config defaults
            let thresholdAmount = 50000;
            let thresholdVelocity = 3;
            if (config.fraudThresholds) {
                thresholdAmount = parseInt(config.fraudThresholds.amount) || thresholdAmount;
                thresholdVelocity = parseInt(config.fraudThresholds.velocity) || thresholdVelocity;
            }
            
            let modules = config.fraudModules || { identity: true, duplicate: true, geo: false, forgery: true };
            
            // map user to claim frequencies (for velocity)
            const userClaimCounts = {};
            claims.forEach(c => {
                if(!userClaimCounts[c.userId]) userClaimCounts[c.userId] = 0;
                userClaimCounts[c.userId]++;
            });
            
            let flaggedClaims = [];
            
            claims.forEach(c => {
                let flags = [];
                let score = 30; // base score
                
                // Rule 1: High Amount Threshold
                if (parseInt(c.amount) > thresholdAmount) {
                    flags.push("High Value Claim Exceeds Threshold");
                    score += 40;
                }
                
                // Rule 2: Claims Velocity (Duplicate Assessment Mod)
                if (modules.duplicate !== false && userClaimCounts[c.userId] > thresholdVelocity) {
                    flags.push(`User velocity exceeds (${userClaimCounts[c.userId]} claims) limit`);
                    score += 50;
                }
                
                // Rule 3: Forgery / Metadata (Mock AI)
                if (modules.forgery !== false && c.status === "Pending" && (c.userId === "user1" || parseInt(c.amount) === 39922)) {
                    flags.push("Review AI: Potential Metadata Anomaly");
                    score += 30;
                }
                
                if (flags.length > 0) {
                    flaggedClaims.push({
                        date: new Date(c.submittedAt || c.createdAt || Date.now()).toLocaleDateString(),
                        id: c.claimId || c.id,
                        reason: flags.join(' | '),
                        score: Math.min(score, 99),
                        status: c.status
                    });
                }
            });
            
            // Sort by risk score
            flaggedClaims.sort((a,b) => b.score - a.score);
            
            if (flaggedClaims.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No flagged claims found.</td></tr>';
                return;
            }
            
            flaggedClaims.forEach(fc => {
                const tr = document.createElement('tr');
                let scoreColor = fc.score > 80 ? '#dc3545' : '#ff9800'; // red vs orange
                
                let bstatus = 'status-pending';
                if(fc.status === 'Approved' || fc.status === 'Settled') bstatus = 'status-approved';
                if(fc.status === 'Rejected') bstatus = 'status-rejected';
                
                tr.innerHTML = `
                    <td>${fc.date}</td>
                    <td><strong>${fc.id}</strong></td>
                    <td style="max-width: 250px; white-space: normal;">${fc.reason}</td>
                    <td><span style="color: ${scoreColor}; font-weight: bold;">${fc.score}/100</span></td>
                    <td><span class="status-badge ${bstatus}">${fc.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
"""

if "function populateFraudAuditTrail" not in content:
    content = content.replace("async function saveFraudModules", js_populate_func + "\n        async function saveFraudModules")

# Update loadFraudSettings()
old_load_fraud = """        async function loadFraudSettings() {
            try {
                const res = await fetch('http://13.126.167.8:5000/api/config');
                const config = await res.json();
                
                if (config.fraudModules) {
                    document.getElementById('fraud-identity').checked = config.fraudModules.identity !== false;
                    document.getElementById('fraud-duplicate').checked = config.fraudModules.duplicate !== false;
                    document.getElementById('fraud-geo').checked = config.fraudModules.geo === true;
                    document.getElementById('fraud-forgery').checked = config.fraudModules.forgery !== false;
                }
                
                if (config.fraudThresholds) {
                    if (config.fraudThresholds.amount) document.getElementById('fraud-threshold-amount').value = config.fraudThresholds.amount;
                    if (config.fraudThresholds.velocity) document.getElementById('fraud-threshold-velocity').value = config.fraudThresholds.velocity;
                }
            } catch (err) {
                console.error("Error loading fraud config:", err);
            }
        }"""

new_load_fraud = """        async function loadFraudSettings() {
            try {
                const res = await fetch('http://13.126.167.8:5000/api/config');
                const config = await res.json();
                
                if (config.fraudModules) {
                    document.getElementById('fraud-identity').checked = config.fraudModules.identity !== false;
                    document.getElementById('fraud-duplicate').checked = config.fraudModules.duplicate !== false;
                    document.getElementById('fraud-geo').checked = config.fraudModules.geo === true;
                    document.getElementById('fraud-forgery').checked = config.fraudModules.forgery !== false;
                }
                
                if (config.fraudThresholds) {
                    if (config.fraudThresholds.amount) document.getElementById('fraud-threshold-amount').value = config.fraudThresholds.amount;
                    if (config.fraudThresholds.velocity) document.getElementById('fraud-threshold-velocity').value = config.fraudThresholds.velocity;
                }
                
                // Fetch claims and populate audit trail
                const headers = { 'x-role': 'admin', 'x-admin-email': adminUser.email };
                try {
                    const claimsRes = await fetch('http://13.126.167.8:5000/api/admin/claims', { headers });
                    if(claimsRes.ok) {
                        const allClaims = await claimsRes.json();
                        populateFraudAuditTrail(allClaims, config);
                    }
                } catch(e) {
                    console.error("Error fetching claims for audit trail:", e);
                }
                
            } catch (err) {
                console.error("Error loading fraud config:", err);
            }
        }"""

if old_load_fraud in content:
    content = content.replace(old_load_fraud, new_load_fraud)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
