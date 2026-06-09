import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "flaggedClaims.sort((a,b) => b.score - a.score);"
replacement = """// Filter to highly suspicious ones to only show actual Fraud
            flaggedClaims = flaggedClaims.filter(fc => fc.score >= 85);
            
            // Sort by risk score
            flaggedClaims.sort((a,b) => b.score - a.score);"""

if target in content:
    content = content.replace(target, replacement)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched admin_dashboard.html successfully")
else:
    print("Error: Target string not found in admin_dashboard.html")
