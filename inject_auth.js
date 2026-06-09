const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;
const scriptTag = '<script src="auth_guard.js"></script>';
const publicPages = ['login.html', 'admin_login.html', 'admin_dashboard.html'];

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        if (path.extname(file) === '.html' && !publicPages.includes(file)) {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Check if already injected
            if (!content.includes('auth_guard.js')) {
                // Find <head> tag and inject securely at the absolute top of the <head> block
                content = content.replace('<head>', '<head>\n    ' + scriptTag);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Injected into ${file}`);
            } else {
                console.log(`Already injected in ${file}`);
            }
        }
    });
});
