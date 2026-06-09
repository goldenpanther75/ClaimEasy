const AWS = require('aws-sdk');

// Configure AWS with environment variables (the SDK automatically reads from ~/.aws/credentials if no explicit keys are provided,
// since we just ran `aws configure` it will use those credentials and region natively)
AWS.config.update({
    region: 'ap-south-1' // We explicitly lock this to Mumbai as requested by the user
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const POLICIES_TABLE = 'ClaimEasy_Policies';
const CLAIMS_TABLE = 'ClaimEasy_Claims';

// --- Policies ---

async function createPolicyDB(policyData) {
    const policyId = 'POL' + Date.now();
    const params = {
        TableName: POLICIES_TABLE,
        Item: {
            ...policyData,
            policyId: policyId,
            createdAt: new Date().toISOString()
        }
    };

    try {
        await dynamodb.put(params).promise();
        return { success: true, policyId: policyId, message: "Policy created successfully in DynamoDB" };
    } catch (error) {
        console.error("Error creating policy in AWS DynamoDB:", error);
        throw error;
    }
}

async function getPolicyByIdDB(policyId) {
    const params = {
        TableName: POLICIES_TABLE,
        Key: { policyId: policyId }
    };

    try {
        const result = await dynamodb.get(params).promise();
        return result.Item || null;
    } catch (error) {
        console.error("Error fetching policy from AWS DynamoDB:", error);
        throw error;
    }
}

async function getAllPoliciesDB() {
    const params = {
        TableName: POLICIES_TABLE
    };

    try {
        const result = await dynamodb.scan(params).promise();
        return result.Items || [];
    } catch (error) {
        console.error("Error fetching all policies from AWS DynamoDB:", error);
        throw error;
    }
}

async function updatePolicyDB(policyId, updateData) {
    const params = {
        TableName: POLICIES_TABLE,
        Item: {
            ...updateData,
            policyId: policyId,
            updatedAt: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
        return { success: true, message: "Policy updated successfully in DynamoDB" };
    } catch (error) {
        console.error("Error updating policy in AWS DynamoDB:", error);
        throw error;
    }
}

async function deletePolicyDB(policyId) {
    const params = {
        TableName: POLICIES_TABLE,
        Key: { policyId: policyId }
    };
    try {
        await dynamodb.delete(params).promise();
        return { success: true, message: "Policy deleted successfully from DynamoDB" };
    } catch (error) {
        console.error("Error deleting policy from AWS DynamoDB:", error);
        throw error;
    }
}

// --- Claims ---

async function createClaimDB(claimData) {
    const claimId = 'CLM' + Date.now();
    const params = {
        TableName: CLAIMS_TABLE,
        Item: {
            ...claimData,
            claimId: claimId,
            status: "Pending",
            submittedAt: new Date().toISOString()
        }
    };

    try {
        await dynamodb.put(params).promise();
        return { success: true, claimId: claimId, message: "Claim submitted successfully to DynamoDB" };
    } catch (error) {
        console.error("Error creating claim in AWS DynamoDB:", error);
        throw error;
    }
}

async function getClaimByIdDB(claimId) {
    const params = {
        TableName: CLAIMS_TABLE,
        Key: { claimId: claimId }
    };

    try {
        const result = await dynamodb.get(params).promise();
        return result.Item || null;
    } catch (error) {
        console.error("Error fetching claim from AWS DynamoDB:", error);
        throw error;
    }
}

async function getAllClaimsDB() {
    const params = {
        TableName: CLAIMS_TABLE
    };

    try {
        const result = await dynamodb.scan(params).promise();
        return result.Items || [];
    } catch (error) {
        console.error("Error fetching all claims from AWS DynamoDB:", error);
        throw error;
    }
}

async function updateClaimDB(claimId, updateData) {
    const params = {
        TableName: CLAIMS_TABLE,
        Item: {
            ...updateData,
            claimId: claimId,
            updatedAt: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
        return { success: true, message: "Claim updated successfully in DynamoDB" };
    } catch (error) {
        console.error("Error updating claim in AWS DynamoDB:", error);
        throw error;
    }
}

const USERS_TABLE = 'ClaimEasy_Users';

// --- Users ---

async function createUserDB(userData) {
    // Generate ID if not provided, else use phone or email as primary string
    const userId = userData.id || Date.now().toString();
    const params = {
        TableName: USERS_TABLE,
        Item: {
            ...userData,
            id: userId,
            createdAt: new Date().toISOString()
        }
    };

    try {
        await dynamodb.put(params).promise();
        return { success: true, user: params.Item, message: "User created successfully in DynamoDB" };
    } catch (error) {
        console.error("Error creating user in AWS DynamoDB:", error);
        throw error;
    }
}

async function getAllUsersDB() {
    const params = {
        TableName: USERS_TABLE
    };

    try {
        const result = await dynamodb.scan(params).promise();
        return result.Items || [];
    } catch (error) {
        console.error("Error fetching all users from AWS DynamoDB:", error);
        throw error;
    }
}


const SUPPORT_TABLE = 'ClaimEasy_Support';
const LOGS_TABLE = 'ClaimEasy_Logs';
const EMAILS_TABLE = 'ClaimEasy_Emails';
const CONFIG_TABLE = 'ClaimEasy_Config';

// --- Support / Cancellations ---
async function createSupportTicketDB(ticketData) {
    const ticketId = ticketData.id || 'CAN-' + Date.now();
    const params = {
        TableName: SUPPORT_TABLE,
        Item: {
            ...ticketData,
            id: ticketId,
            createdAt: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
        return { success: true, id: ticketId };
    } catch (e) {
        console.error("AWS Error Support:", e);
        throw e;
    }
}

async function getAllSupportTicketsDB() {
    try {
        const result = await dynamodb.scan({ TableName: SUPPORT_TABLE }).promise();
        return result.Items || [];
    } catch (e) {
        throw e;
    }
}

// --- Admin Logs ---
async function logActionDB(actionInfo) {
    const logId = actionInfo.id || 'LOG-' + Date.now();
    const params = {
        TableName: LOGS_TABLE,
        Item: {
            ...actionInfo,
            id: logId,
            timestamp: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
    } catch (e) {
        console.error("AWS Error Log:", e);
    }
}

async function getAllLogsDB() {
    try {
        const result = await dynamodb.scan({ TableName: LOGS_TABLE }).promise();
        // Sort newest first
        const sorted = (result.Items || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return sorted.slice(0, 500); // Limit conceptually
    } catch (e) {
        return [];
    }
}

// --- Emails ---
async function logEmailDB(emailData) {
    const emailId = 'EML-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const params = {
        TableName: EMAILS_TABLE,
        Item: {
            id: emailId,
            to: emailData.to,
            subject: emailData.subject,
            type: emailData.type || 'Notification',
            status: emailData.status || 'Sent',
            body: emailData.body || '',
            sentAt: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
    } catch (e) {
        console.error("AWS Error Email Log:", e);
    }
}

async function getAllEmailsDB() {
    try {
        const result = await dynamodb.scan({ TableName: EMAILS_TABLE }).promise();
        const sorted = (result.Items || []).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
        return sorted.slice(0, 500); // Limit conceptually
    } catch (e) {
        return [];
    }
}

// --- Config ---
async function getConfigDB() {
    try {
        const result = await dynamodb.scan({ TableName: CONFIG_TABLE }).promise();
        // Pack back from multiple rows, or single row 'global'
        const config = { logoUrl: "", heroConfig: {}, customSections: [], fraudModules: {}, fraudThresholds: {} };
        (result.Items || []).forEach(item => {
            if (item.category === 'global') Object.assign(config, item.data);
            else if (item.category === 'heroConfig') config.heroConfig = item.data;
            else if (item.category === 'customSections') config.customSections = item.data;
            else if (item.category === 'fraudModules') config.fraudModules = item.data;
            else if (item.category === 'fraudThresholds') config.fraudThresholds = item.data;
        });
        return config;
    } catch (e) {
        return { logoUrl: "", heroConfig: { coverage: "₹5 Cr", price: "₹490" }, customSections: [] };
    }
}

async function updateConfigCategoryDB(category, data) {
    const params = {
        TableName: CONFIG_TABLE,
        Item: {
            category: category,
            data: data,
            updatedAt: new Date().toISOString()
        }
    };
    try {
        await dynamodb.put(params).promise();
        return true;
    } catch (e) {
        console.error("AWS Error Config:", e);
        return false;
    }
}


module.exports = {
    createPolicyDB,
    getPolicyByIdDB,
    getAllPoliciesDB,
    updatePolicyDB,
    deletePolicyDB,
    createClaimDB,
    getClaimByIdDB,
    getAllClaimsDB,
    updateClaimDB,
    createUserDB,
    getAllUsersDB,
    createSupportTicketDB,
    getAllSupportTicketsDB,
    logActionDB,
    getAllLogsDB,
    logEmailDB,
    getAllEmailsDB,
    getConfigDB,
    updateConfigCategoryDB
};
