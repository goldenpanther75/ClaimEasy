with open('admin_dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = """            <!-- View: Fraud & Risk Management -->
            <div id="view-fraud" class="content-view">
                <h3>Fraud & Risk Management</h3>
                <p style="color: #666; margin-bottom: 20px;">Manage automated fraud detection and configure risk thresholds.</p>

                <!-- Fraud Detection Modules -->
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 20px;">
                    <h4>Fraud Detection Modules</h4>
                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
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
                </div>

                <!-- Risk Thresholds -->
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 20px;">
                    <h4>Configure Alerts &amp; Thresholds</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div class="form-group">
                            <label>High Risk Claim Amount Threshold (&#8377;)</label>
                            <input type="number" class="form-control" value="50000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                        <div class="form-group">
                            <label>Max Claims Velocity (Per User / Year)</label>
                            <input type="number" class="form-control" value="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" style="margin-top: 15px;" onclick="document.querySelector('.toast') ? showToast('Thresholds Updated successfully!') : alert('Thresholds Updated successfully!');">Update Thresholds</button>
                </div>

                <!-- Audit Trail of Flagged Claims -->
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0;">Audit Trail: Flagged Claims</h4>
                        <button class="btn btn-outline btn-sm"><i class="fas fa-download"></i> Export Log</button>
                    </div>
                    <table class="data-table" style="width: 100%;">
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
                    </table>
                </div>
            </div> <!-- End of view-fraud -->
"""

del lines[467:525]
new_lines = new_content.splitlines(True)
for line in reversed(new_lines):
    lines.insert(467, line)

with open('admin_dashboard.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
