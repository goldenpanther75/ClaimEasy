const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const users = [
    { id: 'USR1001', name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'user', status: 'Active' },
    { id: 'USR1002', name: 'Priya Patel', email: 'priya.p@example.com', role: 'user', status: 'Active' },
    { id: 'USR1003', name: 'Amit Kumar', email: 'amit.k@example.com', role: 'user', status: 'Inactive' },
    { id: 'USR1004', name: 'Neha Gupta', email: 'neha.g@example.com', role: 'user', status: 'Active' }
];

const policies = [
    { policyId: 'POL2001', userId: 'USR1001', type: 'Car Insurance', premium: '15000', status: 'Active' },
    { policyId: 'POL2002', userId: 'USR1002', type: 'Health Insurance', premium: '25000', status: 'Active' },
    { policyId: 'POL2003', userId: 'USR1003', type: 'Life Insurance', premium: '50000', status: 'Active' },
    { policyId: 'POL2004', userId: 'USR1004', type: 'Bike Insurance', premium: '3000', status: 'Active' }
];

const claims = [
    { claimId: 'CLM3001', userId: 'USR1001', policyId: 'POL2001', policyType: 'Car Insurance', amount: '12000', status: 'Pending', date: '2026-03-01' },
    { claimId: 'CLM3002', userId: 'USR1002', policyId: 'POL2002', policyType: 'Health Insurance', amount: '45000', status: 'Approved', date: '2026-02-28' },
    { claimId: 'CLM3003', userId: 'USR1004', policyId: 'POL2004', policyType: 'Bike Insurance', amount: '8000', status: 'Pending', date: '2026-03-01' },
    { claimId: 'CLM3004', userId: 'USR1003', policyId: 'POL2003', policyType: 'Life Insurance', amount: '500000', status: 'Rejected', date: '2026-02-15' },
    { claimId: 'CLM3005', userId: 'USR1001', policyId: 'POL2001', policyType: 'Car Insurance', amount: '60000', status: 'Pending', date: '2026-03-01' }
];

async function seedData() {
    try {
        console.log("Seeding Users...");
        for (const user of users) {
            await dynamodb.put({ TableName: 'ClaimEasy_Users', Item: user }).promise();
        }

        console.log("Seeding Policies...");
        for (const policy of policies) {
            await dynamodb.put({ TableName: 'ClaimEasy_Policies', Item: policy }).promise();
        }

        console.log("Seeding Claims...");
        for (const claim of claims) {
            await dynamodb.put({ TableName: 'ClaimEasy_Claims', Item: claim }).promise();
        }

        console.log("Database successfully seeded!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

seedData();
