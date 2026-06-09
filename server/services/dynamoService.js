const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/awsConfig");

const TABLE_NAME = "Policies"; // Ensure this table exists in your AWS Console

const createPolicy = async (policyData) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            policyId: `POL-${Date.now()}`, // Simple ID generation
            createdAt: new Date().toISOString(),
            ...policyData,
        },
    };

    try {
        const command = new PutCommand(params);
        await docClient.send(command);
        return { success: true, message: "Policy created successfully", policyId: params.Item.policyId };
    } catch (error) {
        console.error("Error creating policy:", error);
        throw new Error("Could not create policy");
    }
};

const getPolicies = async () => {
    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const command = new ScanCommand(params);
        const response = await docClient.send(command);
        return response.Items;
    } catch (error) {
        console.error("Error retrieving policies:", error);
        throw new Error("Could not retrieve policies");
    }
};

const CLAIM_TABLE_NAME = "Claims"; // Ensure this table exists

const createClaim = async (claimData) => {
    const params = {
        TableName: CLAIM_TABLE_NAME,
        Item: {
            claimId: `CLM-${Date.now()}`,
            status: 'Submitted',
            createdAt: new Date().toISOString(),
            ...claimData,
        },
    };

    try {
        const command = new PutCommand(params);
        await docClient.send(command);
        return { success: true, message: "Claim submitted successfully", claimId: params.Item.claimId };
    } catch (error) {
        console.error("Error creating claim:", error);
        throw new Error("Could not submit claim");
    }
};

const getClaim = async (claimId) => {
    // Ideally use GetCommand for specific ID, but reusing Scan for now (or implement query)
    // For simplicity in this clone, we might just scan and filter (inefficient but works for small data)
    // Better: use GetCommand
    const { GetCommand } = require("@aws-sdk/lib-dynamodb");
    const params = {
        TableName: CLAIM_TABLE_NAME,
        Key: { claimId: claimId }
    };

    try {
        const command = new GetCommand(params);
        const response = await docClient.send(command);
        return response.Item;
    } catch (error) {
        console.error("Error retrieving claim:", error);
        throw new Error("Could not retrieve claim");
    }
};

module.exports = { createPolicy, getPolicies, createClaim, getClaim };
