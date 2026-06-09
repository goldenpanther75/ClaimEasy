const { getAllEmailsDB } = require('./server/services/awsService');

async function checkEmails() {
    try {
        console.log("Fetching latest emails from DynamoDB...");
        const emails = await getAllEmailsDB();
        console.log(`Found ${emails.length} email records.`);
        
        // Take top 10
        const latest = emails.slice(0, 10);
        latest.forEach(e => {
            console.log(`[${e.sentAt}] To: ${e.to}, Subject: ${e.subject}, Status: ${e.status}`);
        });
    } catch (e) {
        console.error("Error checking emails:", e);
    }
}

checkEmails();
