const fs = require('fs');
const path = require('path');

const files = [
    'travel_claim.html',
    'TermLife_claim.html',
    'car_claim.html',
    'home_claim.html',
    'health_claim.html',
    'bike_claim.html'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find all file inputs that don't already have 'required' and add it
        // We look for '<input type="file"' and replace with '<input type="file" required'
        let updatedContent = content.replace(/<input\s+type="file"([^>]*?)>/g, (match, p1) => {
            if (!p1.includes('required')) {
                return `<input type="file" required${p1}>`;
            }
            return match;
        });

        // Also handle the case where the id is first like `<input id="firCopy" type="file"`
        updatedContent = updatedContent.replace(/<input([^>]*?)type="file"([^>]*?)>/g, (match, p1, p2) => {
             // If already required, skip
             if (p1.includes('required') || p2.includes('required')) return match;
             return `<input${p1}type="file" required${p2}>`;
        });

        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes needed for ${file}`);
        }
    }
});
