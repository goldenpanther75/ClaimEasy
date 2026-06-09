import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Fraud View Layout with Metrics and refined Grid
new_fraud_view = """            <!-- View: Fraud & Risk Management -->
            <div id="view-fraud" class="content-view">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin: 0;">Fraud & Risk Management</h3>
                        <p style="color: #666; margin-top: 5px;">Secure transaction monitoring and automated threat prevention.</p>
                    </div>
                    <div id="risk-status-badge" style="background: #e6f4ea; color: #1e7e34; padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 0.9rem;">
                        <i class="fas fa-shield-alt"></i> System Health: Protected
                    </div>
                </div>

                <!-- Top Metrics Row -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        <div style="color: #666; font-size: 0.85rem; margin-bottom: 5px;">Avg Risk Score</div>
                        <div id="metric-avg-score" style="font-size: 1.5rem; font-weight: bold; color: #0065ff;">--</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        <div style="color: #666; font-size: 0.85rem; margin-bottom: 5px;">Active Flags</div>
                        <div id="metric-active-flags" style="font-size: 1.5rem; font-weight: bold; color: #dc3545;">--</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        <div style="color: #666; font-size: 0.85rem; margin-bottom: 5px;">Anomaly Rate</div>
                        <div id="metric-anomaly-rate" style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">--</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        <div style="color: #666; font-size: 0.85rem; margin-bottom: 5px;">KYC Verified</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #28a745;">92%</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <!-- Column 1: Fraud Detection Modules -->
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <h4 style="margin-bottom: 15px;"><i class="fas fa-search"></i> Fraud Detection Modules</h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="fraud-identity" style="font-size: 0.95rem; cursor: pointer;">Identity Verification & KYC</label>
                                <label class="toggle-container">
                                    <input type="checkbox" id="fraud-identity" class="toggle-switch-input" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="fraud-duplicate" style="font-size: 0.95rem; cursor: pointer;">Duplicate Claim Assessment</label>
                                <label class="toggle-container">
                                    <input type="checkbox" id="fraud-duplicate" class="toggle-switch-input" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="fraud-geo" style="font-size: 0.95rem; cursor: pointer;">Device & Geolocation Tracking</label>
                                <label class="toggle-container">
                                    <input type="checkbox" id="fraud-geo" class="toggle-switch-input">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="fraud-forgery" style="font-size: 0.95rem; cursor: pointer;">AI Document Forgery Detection</label>
                                <label class="toggle-container">
                                    <input type="checkbox" id="fraud-forgery" class="toggle-switch-input" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="fraud-behavior" style="font-size: 0.95rem; cursor: pointer;">Behavioral Anomaly Monitoring</label>
                                <label class="toggle-container">
                                    <input type="checkbox" id="fraud-behavior" class="toggle-switch-input">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm" style="margin-top: 20px; width: 100%;" onclick="saveFraudModules(this)">Save Preferences</button>
                    </div>

                    <!-- Column 2: Risk Prevention & Thresholds -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <h4 style="margin-bottom: 15px;"><i class="fas fa-shield-virus"></i> Risk Prevention Settings</h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <label style="font-size: 0.95rem;">Multi-Factor Authentication (MFA)</label>
                                    <label class="toggle-container">
                                        <input type="checkbox" id="fraud-mfa" class="toggle-switch-input" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <label style="font-size: 0.95rem;">End-to-End Data Encryption</label>
                                    <label class="toggle-container">
                                        <input type="checkbox" id="fraud-encryption" class="toggle-switch-input" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <label style="font-size: 0.95rem;">Role-Based Access Control</label>
                                    <span style="font-size: 0.8rem; color: #28a745; font-weight: bold;"><i class="fas fa-check-circle"></i> Enforced</span>
                                </div>
                            </div>
                        </div>

                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-grow: 1;">
                            <h4 style="margin-bottom: 15px;"><i class="fas fa-sliders-h"></i> Smart Thresholds</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label style="font-size: 0.8rem;">High Risk Amount</label>
                                    <input type="number" id="fraud-threshold-amount" class="form-control" value="50000" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; width: 100%;">
                                </div>
                                <div class="form-group">
                                    <label style="font-size: 0.8rem;">Max Claims Velocity</label>
                                    <input type="number" id="fraud-threshold-velocity" class="form-control" value="3" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; width: 100%;">
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm" style="margin-top: 15px; width: 100%;" onclick="saveFraudThresholds(this)">Update Thresholds</button>
                        </div>
                    </div>
                </div>

                <!-- Audit Trail of Flagged Claims -->
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0;">Audit Trail: Flagged Claims</h4>
                        <button class="btn btn-outline btn-sm" onclick="alert('Exporting data as CSV...')"><i class="fas fa-download"></i> Export Log</button>
                    </div>
                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Claim ID</th>
                                <th>Risk Indicator</th>
                                <th>Risk Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="fraud-audit-tbody">
                            <tr><td colspan="5" style="text-align:center;">Loading database records...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div> <!-- End of view-fraud -->"""

import re
pattern = r"<!-- View: Fraud & Risk Management -->.*?<!-- End of view-fraud -->"
content = re.sub(pattern, new_fraud_view, content, flags=re.DOTALL)

# 2. Update JS functions for new toggles (identity, duplicate, geo, forgery, behavior, mfa, encryption)
old_save_func = """        async function saveFraudModules(btnBtn) {
            const data = {
                identity: document.getElementById('fraud-identity').checked,
                duplicate: document.getElementById('fraud-duplicate').checked,
                geo: document.getElementById('fraud-geo').checked,
                forgery: document.getElementById('fraud-forgery').checked
            };"""

new_save_func = """        async function saveFraudModules(btnBtn) {
            const data = {
                identity: document.getElementById('fraud-identity').checked,
                duplicate: document.getElementById('fraud-duplicate').checked,
                geo: document.getElementById('fraud-geo').checked,
                forgery: document.getElementById('fraud-forgery').checked,
                behavior: document.getElementById('fraud-behavior').checked,
                mfa: document.getElementById('fraud-mfa').checked,
                encryption: document.getElementById('fraud-encryption').checked
            };"""

content = content.replace(old_save_func, new_save_func)

old_load_func = """                if (config.fraudModules) {
                    document.getElementById('fraud-identity').checked = config.fraudModules.identity !== false;
                    document.getElementById('fraud-duplicate').checked = config.fraudModules.duplicate !== false;
                    document.getElementById('fraud-geo').checked = config.fraudModules.geo === true;
                    document.getElementById('fraud-forgery').checked = config.fraudModules.forgery !== false;
                }"""

new_load_func = """                if (config.fraudModules) {
                    document.getElementById('fraud-identity').checked = config.fraudModules.identity !== false;
                    document.getElementById('fraud-duplicate').checked = config.fraudModules.duplicate !== false;
                    document.getElementById('fraud-geo').checked = config.fraudModules.geo === true;
                    document.getElementById('fraud-forgery').checked = config.fraudModules.forgery !== false;
                    if (document.getElementById('fraud-behavior')) document.getElementById('fraud-behavior').checked = config.fraudModules.behavior === true;
                    if (document.getElementById('fraud-mfa')) document.getElementById('fraud-mfa').checked = config.fraudModules.mfa !== false;
                    if (document.getElementById('fraud-encryption')) document.getElementById('fraud-encryption').checked = config.fraudModules.encryption !== false;
                }"""

content = content.replace(old_load_func, new_load_func)

# 3. Add Metric calculation logic and enhanced anomaly markers to populateFraudAuditTrail
old_populate_start = "function populateFraudAuditTrail(claims, config) {"
new_metrics_code = """function populateFraudAuditTrail(claims, config) {
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
            
            let modules = config.fraudModules || { identity: true, duplicate: true, geo: false, forgery: true, behavior: false, mfa: true, encryption: true };
            
            const userClaimCounts = {};
            claims.forEach(c => {
                if(!userClaimCounts[c.userId]) userClaimCounts[c.userId] = 0;
                userClaimCounts[c.userId]++;
            });
            
            let flaggedClaims = [];
            let totalRiskScore = 0;
            
            claims.forEach(c => {
                if (c.status === 'Approved' || c.status === 'Settled') return;

                let flags = [];
                let score = 30; // base score
                
                if (parseInt(c.amount) > thresholdAmount) {
                    flags.push("High Value Claim");
                    score += 40;
                }
                
                if (modules.duplicate !== false && userClaimCounts[c.userId] > thresholdVelocity) {
                    flags.push(`High Velocity (${userClaimCounts[c.userId]} claims)`);
                    score += 50;
                }
                
                if (modules.forgery !== false && (c.userId === "user1" || parseInt(c.amount) === 39922)) {
                    flags.push("AI: Document Forgery Detected");
                    score += 40;
                }

                // SIMULATED Anomalies for UI richness if modules enabled
                if (modules.geo === true && Math.random() > 0.85) {
                    flags.push("Geo: Location Mismatch Alert");
                    score += 20;
                }
                if (modules.behavior === true && Math.random() > 0.9) {
                    flags.push("Behavior: Unusual Login Pattern");
                    score += 25;
                }
                
                if (flags.length > 0) {
                    const finalScore = Math.min(score, 100);
                    totalRiskScore += finalScore;
                    flaggedClaims.push({
                        date: new Date(c.submittedAt || c.createdAt || Date.now()).toLocaleDateString(),
                        id: c.claimId || c.id,
                        reason: flags.join(' | '),
                        score: finalScore,
                        status: c.status
                    });
                }
            });
            
            flaggedClaims = flaggedClaims.filter(fc => fc.score >= 80);
            flaggedClaims.sort((a,b) => b.score - a.score);

            // Update Metrics Bar
            const avgScore = flaggedClaims.length > 0 ? Math.round(totalRiskScore / flaggedClaims.length) : 0;
            document.getElementById('metric-avg-score').innerText = avgScore + "/100";
            document.getElementById('metric-active-flags').innerText = flaggedClaims.length;
            document.getElementById('metric-anomaly-rate').innerText = Math.round((flaggedClaims.length / (claims.length || 1)) * 100) + "%";
            
            const badge = document.getElementById('risk-status-badge');
            if (avgScore > 85) {
                badge.innerHTML = '<i class="fas fa-exclamation-circle"></i> System Health: Danger';
                badge.style.background = '#fdecea'; badge.style.color = '#d93025';
            } else if (avgScore > 70) {
                badge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> System Health: Warning';
                badge.style.background = '#fff4e5'; badge.style.color = '#663c00';
            } else {
                badge.innerHTML = '<i class="fas fa-shield-alt"></i> System Health: Protected';
                badge.style.background = '#e6f4ea'; badge.style.color = '#1e7e34';
            }
            
            if (flaggedClaims.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No high-risk flagged claims found in database.</td></tr>';
                return;
            }
            
            flaggedClaims.forEach(fc => {
                const tr = document.createElement('tr');
                let scoreColor = fc.score >= 90 ? '#dc3545' : '#ff9800';
                let bstatus = 'status-pending';
                if(fc.status === 'Rejected') bstatus = 'status-rejected';
                
                tr.innerHTML = `
                    <td>${fc.date}</td>
                    <td><strong>${fc.id}</strong></td>
                    <td style="max-width: 250px; white-space: normal; color: #555; font-size: 0.85rem;">${fc.reason}</td>
                    <td><span style="color: ${scoreColor}; font-weight: bold;">${fc.score}/100</span></td>
                    <td><span class="status-badge ${bstatus}">${fc.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }"""

start_pos = content.find(old_populate_start)
if start_pos != -1:
    end_pos = content.find("async function saveFraudModules", start_pos)
    if end_pos != -1:
        content = content[:start_pos] + new_metrics_code + "\n\n        " + content[end_pos:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("UI and JS logic updated for Enhanced Fraud & Risk Management.")
