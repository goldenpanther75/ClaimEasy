import os

file_path = r'server\services\awsService.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "else if (item.category === 'customSections') config.customSections = item.data;" in line:
        indent = line[:len(line) - len(line.lstrip())]
        new_lines.append(indent + "else if (item.category === 'fraudModules') config.fraudModules = item.data;\n")
        new_lines.append(indent + "else if (item.category === 'fraudThresholds') config.fraudThresholds = item.data;\n")

# Need to also initialize it
# const config = { logoUrl: "", heroConfig: {}, customSections: [] };
for i, line in enumerate(new_lines):
    if "const config = { logoUrl: \"\", heroConfig: {}, customSections: [] };" in line:
        new_lines[i] = line.replace("customSections: []", "customSections: [], fraudModules: {}, fraudThresholds: {}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated awsService.js locally")
