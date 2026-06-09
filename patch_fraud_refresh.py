import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Fraud Modules Preferences Saved successfully!');
                    } else {
                        alert("Error saving modular settings.");
                    }
                }, 400);"""

replacement1 = """                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Fraud Modules Preferences Saved successfully!');
                        loadFraudSettings(); // Refresh table with new values
                    } else {
                        alert("Error saving modular settings.");
                    }
                }, 400);"""

target2 = """                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Risk Thresholds Updated successfully!');
                    } else {
                        alert("Error updating risk thresholds.");
                    }
                }, 400);"""

replacement2 = """                setTimeout(() => {
                    btnBtn.innerText = origText;
                    if (res.ok) {
                        alert('Risk Thresholds Updated successfully!');
                        loadFraudSettings(); // Refresh table with new thresholds
                    } else {
                        alert("Error updating risk thresholds.");
                    }
                }, 400);"""

patched1 = False
if target1 in content:
    content = content.replace(target1, replacement1)
    patched1 = True
    
patched2 = False
if target2 in content:
    content = content.replace(target2, replacement2)
    patched2 = True

if patched1 or patched2:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched admin_dashboard.html successfully. P1: {patched1}, P2: {patched2}")
else:
    print("Error: Target strings not found in admin_dashboard.html")
    print("Looking for:\n", target1, "\n\n", target2)
