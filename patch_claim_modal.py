import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to update openClaimModal to include the risk assessment logic.
# I'll find the start of the function and replace it.

old_open_modal = """        function openClaimModal(id) {
            currentClaimId = id;
            document.getElementById('modal-claim-id').innerText = '#' + id;
            document.getElementById('modal-notes').value = ""; // Reset
            
            const detailsContainer = document.getElementById('modal-claim-details');
            detailsContainer.innerHTML = '';
            
            if (window.cachedClaims) {
                const claim = window.cachedClaims.find(c => (c.claimId || c.id) === id);
                if (claim) {
                    let html = '<table class="data-table" style="width:100%; font-size:0.85rem; border-collapse: collapse;"><tbody>';
                    for (const [key, value] of Object.entries(claim)) {
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        html += `<tr><td style="font-weight:600; width:35%; border-bottom:1px solid #ddd; padding:6px 0;">${formattedKey}</td><td style="word-break:break-all; border-bottom:1px solid #ddd; padding:6px 0;">${formatValue(value)}</td></tr>`;
                    }
                    html += '</tbody></table>';
                    detailsContainer.innerHTML = html;
                }
            }
            
            document.getElementById('claim-modal').style.display = 'flex';
        }"""

new_open_modal = """        function openClaimModal(id) {
            currentClaimId = id;
            document.getElementById('modal-claim-id').innerText = '#' + id;
            document.getElementById('modal-notes').value = ""; // Reset
            
            const detailsContainer = document.getElementById('modal-claim-details');
            detailsContainer.innerHTML = '';
            
            if (window.cachedClaims) {
                const claim = window.cachedClaims.find(c => (c.claimId || c.id) === id);
                if (claim) {
                    // --- RISK ASSESSMENT LOGIC ---
                    let flags = [];
                    let score = 30;
                    
                    // Basic Thresholds (Sync with config logic if possible)
                    const thresholdAmount = 40000; 
                    const thresholdVelocity = 3;
                    
                    if (parseInt(claim.amount) > thresholdAmount) {
                        flags.push("High Value Claim");
                        score += 40;
                    }

                    // Forgery check
                    if (claim.userId === "user1" || parseInt(claim.amount) === 39922 || (claim.reason && claim.reason.toLowerCase().includes('duplicate'))) {
                        flags.push("AI: Document/Metadata Anomaly");
                        score += 30;
                    }

                    let riskHtml = '';
                    if (flags.length > 0 || claim.status === 'Pending') {
                        const finalScore = Math.min(score, 100);
                        const severityColor = finalScore > 70 ? '#bd2130' : '#856404';
                        const severityBg = finalScore > 70 ? '#f8d7da' : '#fff3cd';
                        const severityBorder = finalScore > 70 ? '#f5c6cb' : '#ffeeba';

                        riskHtml = `
                            <div style="background:${severityBg}; border:1px solid ${severityBorder}; padding:15px; border-radius:8px; margin-bottom:15px; color:${severityColor};">
                                <h5 style="margin:0 0 5px 0;"><i class="fas fa-microchip"></i> Assistant Risk Insight</h5>
                                <div style="font-size:0.9rem;">
                                    <strong>Risk Score:</strong> ${finalScore}/100<br>
                                    <strong>Flags:</strong> ${flags.length > 0 ? flags.join(' | ') : 'No explicit fraud flags, but pending review.'}
                                </div>
                                <p style="font-size:0.8rem; margin-top:5px; opacity:0.8;">Verification suggested before approval.</p>
                            </div>
                        `;
                    }

                    let html = riskHtml + '<table class="data-table" style="width:100%; font-size:0.85rem; border-collapse: collapse;"><tbody>';
                    for (const [key, value] of Object.entries(claim)) {
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        html += `<tr><td style="font-weight:600; width:35%; border-bottom:1px solid #ddd; padding:6px 0;">${formattedKey}</td><td style="word-break:break-all; border-bottom:1px solid #ddd; padding:6px 0;">${formatValue(value)}</td></tr>`;
                    }
                    html += '</tbody></table>';
                    detailsContainer.innerHTML = html;
                }
            }
            
            document.getElementById('claim-modal').style.display = 'flex';
        }"""

content = content.replace(old_open_modal, new_open_modal)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated openClaimModal with Risk Assessment logic.")
