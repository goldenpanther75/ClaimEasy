import os

file_path = 'admin_dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the config update URLs
old_url = "'http://13.126.167.8:5000/api/admin/config/update'"
new_url = "'http://13.126.167.8:5000/api/config/update'"

content = content.replace(old_url, new_url)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Replaced {old_url} with {new_url}")
