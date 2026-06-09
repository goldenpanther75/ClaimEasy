import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS for toggle switches into the <head> <style> section
css_toggles = """
        /* Toggle Switch Styles */
        .toggle-container {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .toggle-switch-input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        .toggle-switch-input:checked + .toggle-slider {
            background-color: #0065ff;
        }
        .toggle-switch-input:checked + .toggle-slider:before {
            transform: translateX(22px);
        }
"""
if "/* Toggle Switch Styles */" not in content:
    content = content.replace("</style>", css_toggles + "</style>")


# 2. Update HTML checkboxes to use the new toggle switches and add IDs
html_old_modules = """                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.05rem;">Identity Verification &amp; KYC Engine</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.05rem;">Duplicate Claim Assessment</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.05rem;">Geographic Risk Profiling</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.05rem;">Document Forgery Detection (AI)</span>
                        </label>
                    </div>
                    <button class="btn btn-primary btn-sm" style="margin-top: 15px;" onclick="document.querySelector('.toast') ? showToast('Modules Updated successfully!') : alert('Modules Updated successfully!');">Save Preferences</button>
"""

html_new_modules = """                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; align-items: center;">
                            <label class="toggle-container">
                                <input type="checkbox" id="fraud-identity" class="toggle-switch-input" checked>
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="fraud-identity" style="font-size: 1.05rem; cursor: pointer; margin: 0;">Identity Verification &amp; KYC Engine</label>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <label class="toggle-container">
                                <input type="checkbox" id="fraud-duplicate" class="toggle-switch-input" checked>
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="fraud-duplicate" style="font-size: 1.05rem; cursor: pointer; margin: 0;">Duplicate Claim Assessment</label>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <label class="toggle-container">
                                <input type="checkbox" id="fraud-geo" class="toggle-switch-input">
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="fraud-geo" style="font-size: 1.05rem; cursor: pointer; margin: 0;">Geographic Risk Profiling</label>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <label class="toggle-container">
                                <input type="checkbox" id="fraud-forgery" class="toggle-switch-input" checked>
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="fraud-forgery" style="font-size: 1.05rem; cursor: pointer; margin: 0;">Document Forgery Detection (AI)</label>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" style="margin-top: 25px;" onclick="saveFraudModules(this)">Save Preferences</button>
"""

content = content.replace(html_old_modules, html_new_modules)


html_old_thresholds = """                        <div class="form-group">
                            <label>High Risk Claim Amount Threshold (&#8377;)</label>
                            <input type="number" class="form-control" value="50000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                        <div class="form-group">
                            <label>Max Claims Velocity (Per User / Year)</label>
                            <input type="number" class="form-control" value="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" style="margin-top: 15px;" onclick="document.querySelector('.toast') ? showToast('Thresholds Updated successfully!') : alert('Thresholds Updated successfully!');">Update Thresholds</button>
"""

html_new_thresholds = """                        <div class="form-group">
                            <label>High Risk Claim Amount Threshold (&#8377;)</label>
                            <input type="number" id="fraud-threshold-amount" class="form-control" value="50000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                        <div class="form-group">
                            <label>Max Claims Velocity (Per User / Year)</label>
                            <input type="number" id="fraud-threshold-velocity" class="form-control" value="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" style="margin-top: 15px;" onclick="saveFraudThresholds(this)">Update Thresholds</button>
"""

content = content.replace(html_old_thresholds, html_new_thresholds)


# 3. Add JS functions for fraud actions
js_fraud_funcs = """
        // --- Fraud & Risk Management Logic ---
        async function loadFraudSettings() {
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
        }

        async function saveFraudModules(btnBtn) {
            const data = {
                identity: document.getElementById('fraud-identity').checked,
                duplicate: document.getElementById('fraud-duplicate').checked,
                geo: document.getElementById('fraud-geo').checked,
                forgery: document.getElementById('fraud-forgery').checked
            };
            
            const origText = btnBtn.innerText;
            btnBtn.innerText = "Saving...";
            
            const headers = { 'Content-Type': 'application/json', 'x-role': 'admin', 'x-admin-email': adminUser.email };
            try {
                const res = await fetch('http://13.126.167.8:5000/api/admin/config/update', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ category: 'fraudModules', data })
                });

                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Fraud Modules Preferences Saved successfully!');
                    } else {
                        alert("Error saving modular settings.");
                    }
                }, 400);
            } catch (e) {
                btnBtn.innerText = origText;
                alert("Network error saving fraud settings.");
            }
        }

        async function saveFraudThresholds(btnBtn) {
            const data = {
                amount: parseInt(document.getElementById('fraud-threshold-amount').value) || 50000,
                velocity: parseInt(document.getElementById('fraud-threshold-velocity').value) || 3
            };
            
            const origText = btnBtn.innerText;
            btnBtn.innerText = "Saving...";
            
            const headers = { 'Content-Type': 'application/json', 'x-role': 'admin', 'x-admin-email': adminUser.email };
            try {
                const res = await fetch('http://13.126.167.8:5000/api/admin/config/update', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ category: 'fraudThresholds', data })
                });

                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Risk Thresholds Updated successfully!');
                    } else {
                        alert("Error updating risk thresholds.");
                    }
                }, 400);
            } catch (e) {
                btnBtn.innerText = origText;
                alert("Network error updating thresholds.");
            }
        }
"""

if "function switchTab(viewId, navEl)" in content:
    content = content.replace("function switchTab(viewId, navEl) {", js_fraud_funcs + "\n        function switchTab(viewId, navEl) {")

if "else if (view === 'settings') {" in content:
    # It was removed and replaced, there is no setting. Wait, the old code had:
    pass

# Replace data loading hook
if "loadData(viewId);" in content:
    # Let's ensure loadFraudSettings() is called when view === 'fraud'
    data_loading_hook_str = """
                else if (view === 'logs') {
                    const res = await fetch('http://13.126.167.8:5000/api/admin/logs', { headers });
                    const logs = await res.json();
"""
    data_loading_new = """
                else if (view === 'fraud') {
                    loadFraudSettings();
                }
""" + data_loading_hook_str
    if "else if (view === 'fraud') {" not in content:
        content = content.replace(data_loading_hook_str, data_loading_new)


with open('admin_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully')
